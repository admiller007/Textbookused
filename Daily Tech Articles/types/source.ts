export interface Source {
  id: string;
  name: string;
  type: 'rss' | 'scrape';

  // Source-specific config
  url: string;                   // RSS feed URL or scraping target
  updateFrequency: number;       // Minutes between updates

  // Scraper config (if type === 'scrape')
  scrapingConfig?: {
    listSelector: string;        // CSS selector for article list
    linkSelector: string;        // CSS selector for article links
    customParser?: string;       // Optional custom parser name
  };

  // Metadata
  isEnabled: boolean;
  lastFetchDate?: Date;
  lastFetchStatus?: 'success' | 'error';
  errorMessage?: string;

  // Display
  iconUrl?: string;
  category?: string;
}
