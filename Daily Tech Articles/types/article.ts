export interface Article {
  id: string;                    // Hash of URL + date
  url: string;
  sourceId: string;
  title: string;
  author?: string;
  publishedDate: Date;
  fetchedDate: Date;

  // Content
  excerpt: string;
  fullContent?: string;          // Extracted HTML (lazy loaded)
  imageUrl?: string;

  // Metadata
  category: string[];            // Auto-categorized
  tags: string[];
  readingTime?: number;

  // User state
  isRead: boolean;
  isStarred: boolean;            // For read-later
  readProgress: number;          // 0-100
  lastReadDate?: Date;

  sourceType: 'rss' | 'scrape';
}
