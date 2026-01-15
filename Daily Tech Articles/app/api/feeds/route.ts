import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { generateId } from '@/lib/db';
import type { Article } from '@/types/article';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedUrl, sourceId } = body;

    if (!feedUrl) {
      return NextResponse.json(
        { error: 'Feed URL is required' },
        { status: 400 }
      );
    }

    // Fetch and parse RSS feed
    const feed = await parser.parseURL(feedUrl);

    // Normalize feed items to Article format
    const articles: Article[] = feed.items.map((item) => {
      const publishedDate = item.pubDate ? new Date(item.pubDate) : new Date();
      const url = item.link || item.guid || '';

      // Extract image from various fields
      let imageUrl: string | undefined;
      if (item.enclosure?.url) {
        imageUrl = item.enclosure.url;
      } else if ((item as any).media?.$ && (item as any).media.$.url) {
        imageUrl = (item as any).media.$.url;
      } else if (item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      return {
        id: generateId(url, publishedDate),
        url,
        sourceId: sourceId || 'unknown',
        title: item.title || 'Untitled',
        author: item.creator || item.author,
        publishedDate,
        fetchedDate: new Date(),
        excerpt: item.contentSnippet || item.summary || '',
        imageUrl,
        category: item.categories || [],
        tags: [],
        readingTime: estimateReadingTime(item.contentSnippet || ''),
        isRead: false,
        isStarred: false,
        readProgress: 0,
        sourceType: 'rss' as const,
      };
    });

    return NextResponse.json({
      success: true,
      articles,
      feedTitle: feed.title,
      feedDescription: feed.description,
    });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch RSS feed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
