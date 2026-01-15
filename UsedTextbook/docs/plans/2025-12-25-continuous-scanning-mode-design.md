# Continuous Scanning Mode - Design Document

**Date:** 2025-12-25
**Status:** Approved
**Goal:** Enable users to scan and submit multiple textbooks in a single session with minimal friction

## Problem Statement

Currently, users must complete a full form submission for each textbook. This creates significant friction for students selling multiple books (common at semester end). Users are likely to abandon after 1-2 books due to repetitive data entry.

**Impact:** Lost submissions, reduced inventory, poor user experience for high-value users.

## Solution Overview

Add a "continuous scanning mode" that allows users to:
- Scan multiple books sequentially without leaving camera view
- Quickly assign conditions via modal overlays
- Review all books before submitting
- Enter contact information once at the end

## Design Sections

### 1. Entry Point & Mode Switching

**Default Experience:**
- Single-book form remains the default (no breaking changes)
- Prominent **"📚 Scan Multiple Books"** button at top of form

**Mode Transition:**
- Click button → smooth animation into full-screen camera mode
- Show "Switch to Single Book" option for users who change their mind
- Header shrinks to maximize camera viewport space
- Form fields hide during scanning

**Rationale:** Preserves existing flow for single-book users while making multi-book mode discoverable. No forced change in user behavior.

### 2. Continuous Scanning Flow

**Camera Experience:**
- Full-screen camera with viewfinder overlay
- Semi-transparent list overlay (slides up/down) showing scanned books
- Optimized for speed and visual clarity

**Scan-to-Add Flow:**
1. User points camera at ISBN barcode
2. Quagga2 detects and validates ISBN
3. Fetch book details from Google Books API (show loading indicator)
4. **Modal appears** over camera:
   - Book cover thumbnail
   - Title and author
   - ISBN number
   - Condition dropdown (Like New, Good, Acceptable, Poor)
   - "Add Book" button
5. User selects condition → clicks "Add Book"
6. Modal closes, **camera automatically resumes scanning**
7. Book appears in overlay list with animation

**Visual Feedback:**
- Haptic vibration on successful scan (mobile)
- Green flash around viewfinder edge
- Smooth modal transitions
- Toast notifications for system messages

**Duplicate Detection:**
- Silently ignore duplicate ISBN scans
- Show brief toast: "Already added ✓" (2-second fade)
- Scanner keeps running without interruption

### 3. Error Handling & Fallbacks

**When Google Books API Fails:**
Modal appears with:
- "Book not found in our database"
- Shows scanned ISBN
- Text input: "Book Title (optional)"
- Standard condition dropdown
- "Add Book" button

Book is added as either manual title or "Unknown Book - ISBN: [number]"

**Book List Overlay:**
Shows accumulated books:
- Small cover thumbnail (40x60px)
- Title and author (truncated)
- Condition badge
- "×" delete button
- Scrollable if list grows long
- Count badge: "8 books scanned"

**Exiting Scan Mode:**
Two methods:
1. **"Done Scanning" button** - Fixed at bottom, always visible
2. **Auto-prompt** - After 15 seconds inactivity: "Finished scanning? [Keep Scanning] [Review Books]"

### 4. Review & Edit Screen

**Layout:**
- Header: "Review Your Books"
- Scrollable list of all books:
  - Larger cover thumbnail (80x120px)
  - Title, author, ISBN
  - Condition badge (clickable to edit)
  - Delete button (trash icon)

**Functionality:**
- Click condition badge → dropdown to change
- Click trash icon → book removed with slide-out animation
- "Scan More Books" button (returns to camera, preserves list)
- "Continue" button (proceeds to contact form)

**Data Persistence:**
- **Auto-save to localStorage** at this stage
- On return visit: Banner shows "You have 8 books from your last session. [Continue] [Start Over]"
- **Browser exit warning**: If user tries to close tab with unsaved books, trigger standard browser confirmation

### 5. Contact Information Collection

**Form Fields:**
- Full Name (required)
- Email Address (required, validated)
- Phone Number (required, auto-formatted)
- Additional Notes (optional textarea)

**Context Preservation:**
- Collapsed summary at top: "Submitting 8 books"
- Expandable accordion to review book list
- Keeps context visible during form completion

**Returning User Experience:**
- Pre-fill fields from localStorage if available
- Show notice: "Using saved info from last time. [Edit] [Clear]"

**Validation:**
- Real-time inline validation
- Error messages below each field
- Standard email/phone format checks

**Submit:**
- Large "Submit All Books" button
- Loading state: "Submitting..."
- Batch send to Firebase
- Clear localStorage after success

### 6. Success Experience & Engagement

**Success Screen:**
- Large checkmark/celebration animation
- "Success! We received your 8 books 🎉"

**Engagement Elements:**
- Summary stat: "You've submitted 8 books this semester!" (localStorage tracking)
- Rotating motivational messages:
  - "That's a lot of knowledge to pass on!"
  - "Someone's going to love these books!"
  - "Thanks for keeping textbooks in circulation!"

**Next Actions:**
- **Primary CTA:** "Submit More Books" (clears form, keeps contact info)
- **Secondary:** "Share with Friends" (copy link or native share)
- Optional social proof: "Join 1,247 students who've sold textbooks this month"

**Timeline/Next Steps:**
1. "We review your books within 24 hours"
2. "You'll receive an offer via email"
3. "Accept and ship with our prepaid label"

**Data Cleanup:**
- Clear scanned books from localStorage
- Keep contact info cached
- Reset form state

## Technical Considerations

### Performance
- **No hard limit** on number of books per session
- Monitor rendering performance on large lists
- Optimize Firebase batch writes for 20+ books
- Lazy load book cover images

### Data Storage
- localStorage schema:
  ```javascript
  {
    scannedBooks: [{isbn, title, author, condition, cover}],
    contactInfo: {name, email, phone},
    sessionStats: {totalBooksSubmitted, lastSubmission}
  }
  ```
- Firebase batch write for all books in single transaction
- Include timestamp and session ID for analytics

### Browser Compatibility
- Test camera permissions flow across browsers
- Ensure Quagga2 works on iOS Safari, Chrome Mobile
- Fallback for browsers without camera access (manual ISBN entry)

### Error States
- Camera permission denied
- Network failures during API calls
- Firebase write failures
- Handle partial submissions gracefully

## Success Metrics

- **Conversion rate:** % of users who complete multi-book submissions
- **Books per session:** Average number of books submitted
- **Abandonment points:** Where users drop off in the flow
- **Time to complete:** Duration from first scan to final submission
- **Return rate:** % of users who submit multiple times

## Future Enhancements

- Estimated price display during scanning (requires pricing API)
- Photo upload for book condition verification
- Barcode scanning for non-ISBN books (UPC codes)
- Export scanned list before submission (wishlist feature)
- Integration with textbook buyback APIs for instant offers
