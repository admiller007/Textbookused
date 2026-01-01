# Hybrid Article Categorization System

**Date:** 2026-01-01
**Status:** Design Approved

## Problem Statement

The "By Topic" view currently has 54 articles in "Uncategorized" because:
- Most RSS feeds don't provide category metadata
- Scraped articles always have empty categories
- Source-level categories exist but aren't being applied to articles
- Hacker News articles need content-based categorization

## Solution Overview

Implement a hybrid categorization system that:
1. Immediately assigns source categories to articles (except "General Tech" sources)
2. Uses AI to analyze and categorize articles from generic sources in the background
3. Supports multiple categories per article with high confidence thresholds

## Architecture

### Two-Mode Categorization

**Mode 1: Source-Based (Immediate)**
- Applied during article fetch (RSS/scrape)
- If source has a defined category AND it's not "General Tech", assign it immediately
- Examples:
  - TechCrunch → "Startups"
  - Ars Technica → "Deep Tech"
  - The Verge → "Consumer Tech"

**Mode 2: AI-Based (Background)**
- Runs after sync completes
- Targets articles from "General Tech" sources (like Hacker News) or uncategorized sources
- Analyzes title + excerpt using OpenRouter API
- Returns 1-3 categories with confidence scores
- Only applies categories with >75% confidence (reduces hallucinations)

### Target Categories

Using existing CATEGORIES constant:
- AI/ML
- Web Dev
- Mobile
- DevOps
- Security
- Hardware
- Startups
- General Tech
- Consumer Tech
- Deep Tech

## Implementation Components

### 1. API Route: `/api/categorize`

**Purpose:** Batch categorize articles using AI

**Input:**
```typescript
{
  articles: Array<{
    id: string;
    title: string;
    excerpt: string;
  }>
}
```

**Process:**
- Constructs prompt with CATEGORIES list and article details
- Calls OpenRouter API using free model (meta-llama/llama-3.1-8b-instruct:free or google/gemini-flash-1.5)
- API Key: `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`
- Requests structured JSON: `{ categories: [{ name: string, confidence: number }] }`
- Filters for confidence >75%
- Returns categorized results

**Output:**
```typescript
{
  results: Array<{
    id: string;
    categories: string[];
  }>
}
```

### 2. Hook: `useCategorization`

**Purpose:** Manage background categorization workflow

**Responsibilities:**
- Triggers after `syncAll()` completes
- Queries IndexedDB for uncategorized articles:
  - `(source.category === 'General Tech' OR !source.category) AND category.length === 0`
- Batches articles (10 at a time) to manage rate limits
- Calls `/api/categorize` for each batch
- Updates articles in IndexedDB with new categories
- Provides progress state

**State:**
```typescript
{
  categorizing: boolean;
  progress: number;
  total: number;
  error?: string;
}
```

**Integration:**
- Called from `HomePage` after sync
- Non-blocking - user can continue browsing

### 3. Modified Feed Routes

**Files to Update:**
- `/app/api/feeds/route.ts`
- `/app/api/scrape/route.ts`

**Changes:**
- Accept `sourceId` in request body
- Look up source from constants/database
- If source has category defined and it's not "General Tech":
  - Add to article's category array during creation
  - Example: `category: ['Startups']` for TechCrunch articles

### 4. UI Progress Indicator

**Location:** Header component

**Display:**
- Small badge: "Categorizing articles... 23/54"
- Shows during background categorization
- Auto-hides when complete
- Non-intrusive, doesn't block interaction

## Data Flow

```
1. User clicks "Sync Feeds"
   ↓
2. syncAll() fetches articles
   ↓
3. Feed routes apply source categories (if not "General Tech")
   ↓
4. Articles saved to IndexedDB
   ↓
5. Sync completes, useCategorization hook activates
   ↓
6. Hook queries for uncategorized articles
   ↓
7. Articles batched (10 at a time)
   ↓
8. /api/categorize processes each batch with OpenRouter
   ↓
9. Confident categories (>75%) applied to articles
   ↓
10. IndexedDB updated
   ↓
11. UI refreshes, articles appear in correct topic groups
```

## Configuration

**Environment Variables:**
```env
OPENROUTER_API_KEY=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
```

**Constants:**
- Confidence threshold: 75%
- Batch size: 10 articles
- Max categories per article: 3
- Free OpenRouter model: `meta-llama/llama-3.1-8b-instruct:free` or `google/gemini-flash-1.5`

## Success Criteria

- Articles from categorized sources (TechCrunch, Ars Technica, The Verge) immediately show in correct topic
- Hacker News articles categorized within 30 seconds of sync completing
- Categorization accuracy >80% (spot-check 20 articles)
- No blocking of user interaction during categorization
- Uncategorized count drops from 54 to <10

## Future Enhancements

- Move to server-side background job for better scalability
- Add user ability to manually recategorize or add categories
- Cache categorization results to avoid re-processing
- Add category suggestions for user-created sources
- Support custom categories beyond predefined list
