# Pulse - Tech News Reader

A beautiful, modern tech news aggregator built with Next.js, featuring RSS feeds, web scraping, and a refined editorial design.

## Features

- **Multiple View Modes**: Browse articles chronologically, by source, by category, or your saved reading queue
- **RSS Feed Support**: Aggregates from Hacker News, TechCrunch, Ars Technica, and The Verge
- **Full Reading Experience**: Extract and read articles within the app with annotations
- **Offline Storage**: All data stored locally in IndexedDB
- **Dark Mode**: Automatic dark mode support
- **Beautiful Design**: Editorial-inspired aesthetic with Cormorant Garamond and Manrope typography

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome to see the app.

### Initial Setup

1. The app will automatically initialize the database with default sources
2. Click "Sync Feeds" to fetch the latest articles
3. Browse articles, mark them as read, or save them for later

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Storage**: IndexedDB (via `idb` library)
- **RSS Parsing**: `rss-parser`
- **Web Scraping**: `cheerio`
- **Content Extraction**: `@mozilla/readability` + `jsdom`
- **UI**: Tailwind CSS with custom editorial design
- **Icons**: Lucide Icons

## Project Structure

```
/app
  /api
    /feeds       # RSS feed fetching endpoint
    /scrape      # Web scraping endpoint
    /extract     # Article content extraction
  page.tsx       # Main application page
  layout.tsx     # Root layout
  globals.css    # Global styles

/components
  /layout        # Header and layout components
  /features      # Feature-specific components
    /article-list
    /article-reader
    /annotations
    /read-later
    /sources

/lib
  /db           # IndexedDB wrapper and schema
  /feeds        # Feed fetching and scheduling
  /scrapers     # Web scraping utilities
  /content      # Content extraction and categorization
  /annotations  # Text highlighting and selection

/hooks          # Custom React hooks
/types          # TypeScript type definitions
/constants      # App constants and default sources
```

## Adding New Sources

Edit `/constants/default-sources.ts` to add new RSS feeds or configure web scraping sources.

## License

MIT
