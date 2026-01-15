import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { generateId } from '@/lib/db';
import type { Article } from '@/types/article';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceUrl, sourceId, config } = body;

    if (!sourceUrl || !config) {
      return NextResponse.json(
        { error: 'Source URL and config are required' },
        { status: 400 }
      );
    }

    // Fetch webpage
    const response = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TechNewsReader/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const articles: Article[] = [];

    // Use provided selectors to extract article links
    $(config.listSelector).each((i, elem) => {
      try {
        const $elem = $(elem);
        const link = $elem.find(config.linkSelector).attr('href');
        const title = $elem.find(config.titleSelector || config.linkSelector).text().trim();

        if (!link || !title) return;

        // Make URL absolute if it's relative
        const url = new URL(link, sourceUrl).href;
        const publishedDate = new Date();

        articles.push({
          id: generateId(url, publishedDate),
          url,
          sourceId: sourceId || 'unknown',
          title,
          publishedDate,
          fetchedDate: new Date(),
          excerpt: '',
          category: [],
          tags: [],
          isRead: false,
          isStarred: false,
          readProgress: 0,
          sourceType: 'scrape' as const,
        });
      } catch (error) {
        console.error('Error parsing element:', error);
      }
    });

    return NextResponse.json({
      success: true,
      articles,
      count: articles.length,
    });
  } catch (error) {
    console.error('Error scraping website:', error);
    return NextResponse.json(
      {
        error: 'Failed to scrape website',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
