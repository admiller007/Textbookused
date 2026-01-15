import type { Source } from '@/types/source';

export const DEFAULT_SOURCES: Source[] = [
  {
    id: 'hacker-news',
    name: 'Hacker News',
    type: 'rss',
    url: 'https://news.ycombinator.com/rss',
    updateFrequency: 60,
    isEnabled: true,
    category: 'General Tech',
    iconUrl: 'https://news.ycombinator.com/favicon.ico',
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    type: 'rss',
    url: 'https://techcrunch.com/feed/',
    updateFrequency: 30,
    isEnabled: true,
    category: 'Startups',
    iconUrl: 'https://techcrunch.com/favicon.ico',
  },
  {
    id: 'ars-technica',
    name: 'Ars Technica',
    type: 'rss',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    updateFrequency: 60,
    isEnabled: true,
    category: 'Deep Tech',
    iconUrl: 'https://arstechnica.com/favicon.ico',
  },
  {
    id: 'the-verge',
    name: 'The Verge',
    type: 'rss',
    url: 'https://www.theverge.com/rss/index.xml',
    updateFrequency: 30,
    isEnabled: true,
    category: 'Consumer Tech',
    iconUrl: 'https://www.theverge.com/favicon.ico',
  },
];

export const CATEGORIES = [
  'AI/ML',
  'Web Dev',
  'Mobile',
  'DevOps',
  'Security',
  'Hardware',
  'Startups',
  'General Tech',
  'Consumer Tech',
  'Deep Tech',
] as const;
