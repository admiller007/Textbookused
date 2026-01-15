# Search & Filters Implementation Plan

## Overview

Add full-text search and filtering to the Daily Tech Articles app with automatic content extraction.

**User Requirements:**
- Search across titles, excerpts, and full article content
- Hybrid search: simple text matching → search index for better performance
- Automatic content extraction during RSS sync
- Basic filters: Source, Read/Unread, Starred, Date range

## Implementation Strategy

### Phase 1: Content Extraction (Foundation)

**Goal:** Extract full article content automatically during sync so articles are searchable immediately.

**Files to modify:**
- `/hooks/useFeedSync.ts` - Add content extraction after adding new articles
- `/types/article.ts` - Verify `fullContent` field exists (already present)

**Implementation:**
1. Create `extractContentInBackground()` function in useFeedSync
2. After adding each new article (line 92), trigger background extraction
3. Use rate limiting: max 3 concurrent extractions, 500ms delay between batches
4. Update article in IndexedDB with extracted content
5. Handle extraction failures gracefully (log but don't block sync)

**Extraction flow:**
```
New article added → POST to /api/extract → Update article.fullContent in DB
```

**Note:** `/app/api/extract/route.ts` is already fully implemented with Readability + JSDOM.

---

### Phase 2: Search Implementation

**Goal:** Enable fast, relevant search across all article content.

#### 2.1 Create Search Hook

**New file:** `/hooks/useSearch.ts`

**Features:**
- Debounced search input (300ms delay)
- Simple text matching algorithm with relevance scoring
- Search priority: Title (weight 10) → Excerpt (weight 3) → Content (weight 1)
- Return sorted results by relevance score

**Search algorithm:**
```typescript
// Phase 1: Simple text matching
- Normalize query (lowercase, trim)
- Score each article based on matches in title/excerpt/content
- Sort by score, return matches

// Phase 2 (future): Add Fuse.js for fuzzy search + typo tolerance
```

#### 2.2 Create Search UI Components

**New files:**
- `/components/features/search-filter/SearchBar.tsx` - Search input with debouncing, clear button, loading state
- `/components/features/search-filter/SearchResults.tsx` - Wrapper for ArticleList showing result count and empty states

**SearchBar features:**
- Keyboard shortcut (Cmd/Ctrl + K to focus)
- Clear button when query exists
- Loading spinner during search
- Matches existing design system

#### 2.3 Integrate Search into UI

**Files to modify:**
- `/components/layout/Header.tsx` - Add SearchBar below logo (mobile) or next to view modes (desktop)
- `/app/page.tsx` - Integrate useSearch hook, filter articles before passing to views

**Layout:**
```
Desktop: [Logo] [SearchBar] [View Modes] [Sync]
Mobile:  [Logo]
         [SearchBar]
         [View Modes]
```

---

### Phase 3: Filter Implementation

**Goal:** Allow users to filter articles by source, read status, starred, and date range.

#### 3.1 Create Filter Hook

**New file:** `/hooks/useFilters.ts`

**Features:**
- Manage filter state (sources[], readStatus, starred, dateRange)
- Apply filters with AND logic (all active filters must match)
- Track active filter count for badge
- Persist filters to localStorage (optional)

**Filter logic:**
```typescript
1. Start with all articles
2. Filter by source(s) if selected
3. Filter by read/unread if not "all"
4. Filter by starred if enabled
5. Filter by date range if set
6. Return filtered array
```

#### 3.2 Create Filter UI Components

**New files:**
- `/components/features/search-filter/FilterPanel.tsx` - Dropdown panel with filter controls
- `/components/features/search-filter/FilterPill.tsx` - Removable pill showing active filters

**FilterPanel contents:**
- Source checkboxes (Hacker News, TechCrunch, Ars Technica, The Verge)
- Read status radio buttons (All, Read, Unread)
- Starred toggle
- Date range picker (start/end dates)
- "Clear All Filters" button

**Panel behavior:**
- Slides down from header when filter button clicked
- Applies filters in real-time as user changes selections
- Closes on backdrop click or "Done" button

#### 3.3 Integrate Filters into UI

**Files to modify:**
- `/components/layout/Header.tsx` - Add filter toggle button with badge showing active filter count
- `/app/page.tsx` - Integrate useFilters hook, combine with search results

**Filter pills:**
- Display active filters below header as removable pills
- Click to remove individual filter
- Example: `[Source: HN ×] [Unread ×] [Last 7 days ×]`

---

### Phase 4: Combine Search + Filters

**Goal:** Make search and filters work together seamlessly.

**Implementation in `/app/page.tsx`:**
```typescript
1. Get all articles from DB
2. Apply filters → filtered articles
3. Apply search to filtered articles → final results
4. Pass final results to view components
5. Show result count and active filters
```

**Empty states:**
- No search results: "No articles found for 'query'"
- No filter results: "No articles match your filters" + Clear Filters button
- No results (combined): Show both messages with suggestions

---

## Database Operations

**Files to modify:**
- `/lib/db/index.ts` - Add helper methods for search/filter

**New methods:**
```typescript
articleDB.search(query: string): Promise<Article[]>
articleDB.filter(filters: ArticleFilters): Promise<Article[]>
articleDB.getWithoutContent(): Promise<Article[]> // For tracking extraction status
```

**Performance:**
- Use in-memory filtering (acceptable for <10k articles)
- Existing indexes support filtering (by-sourceId, by-isRead, by-isStarred, by-publishedDate)
- No schema migration needed

---

## Implementation Order

### Week 1: Content Extraction
1. ✅ Verify `/api/extract` endpoint works (already implemented)
2. Add background extraction to `useFeedSync.ts` (after line 92)
3. Test sync with automatic extraction
4. Monitor extraction success rate

### Week 2: Search
1. Create `useSearch.ts` hook with simple text matching
2. Create `SearchBar.tsx` component
3. Integrate SearchBar into `Header.tsx`
4. Update `page.tsx` to use search hook
5. Create `SearchResults.tsx` wrapper
6. Test search performance with 100+ articles

### Week 3: Filters
1. Create `useFilters.ts` hook
2. Create `FilterPanel.tsx` and `FilterPill.tsx` components
3. Integrate filter button into `Header.tsx`
4. Update `page.tsx` to use filter hook
5. Test filter combinations

### Week 4: Polish
1. Combine search + filters in `page.tsx`
2. Add empty states
3. Test on mobile devices
4. Optimize performance (if needed)
5. Add Fuse.js for better search (optional)

---

## Critical Files

**Must modify:**
1. `/hooks/useFeedSync.ts` - Add automatic content extraction
2. `/hooks/useSearch.ts` - New file for search logic
3. `/hooks/useFilters.ts` - New file for filter logic
4. `/components/layout/Header.tsx` - Add SearchBar and filter button
5. `/app/page.tsx` - Orchestrate search + filter state

**New components:**
6. `/components/features/search-filter/SearchBar.tsx`
7. `/components/features/search-filter/FilterPanel.tsx`
8. `/components/features/search-filter/FilterPill.tsx`
9. `/components/features/search-filter/SearchResults.tsx`

**Database:**
10. `/lib/db/index.ts` - Add search/filter helper methods

---

## Technical Considerations

### Content Extraction
- **Rate limiting:** 3 concurrent max, 500ms between batches
- **Timeout:** 10s per article
- **Error handling:** Log failures but don't block sync
- **Fallback:** Search works on title/excerpt even without full content

### Search Performance
- **Debouncing:** 300ms delay on input
- **Target:** <50ms search time for 1000 articles
- **Future:** Add Fuse.js if simple matching feels too rigid

### Filter Persistence
- Save active filters to localStorage
- Restore on page load
- Clear when user clicks "Clear All"

### Mobile UX
- Stack SearchBar below logo on mobile
- Make FilterPanel full-width slide-down
- Ensure filters are touch-friendly

---

## Success Metrics

- [ ] Content extraction: >80% success rate during sync
- [ ] Search: Results appear <100ms after typing stops
- [ ] Filters: Combine correctly with search
- [ ] Mobile: Responsive on 375px width
- [ ] Empty states: Clear messaging when no results
- [ ] User flow: Can find articles 3x faster than scrolling

---

## Future Enhancements (Out of Scope)

- Advanced search operators (AND, OR, NOT)
- Search history and suggestions
- Reading time range filter
- Multiple category selection
- Custom tags
- Virtual scrolling for large result sets
- Web Worker for search indexing
