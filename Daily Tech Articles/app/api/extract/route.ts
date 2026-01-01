import { NextRequest, NextResponse } from 'next/server';

// Dynamic imports to avoid Next.js bundling issues
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Import at runtime to avoid build-time issues
  const { Readability } = await import('@mozilla/readability');
  const { JSDOM } = await import('jsdom');
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Fetch article HTML
    const response = await fetch(url, {
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

    // Parse with Readability
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return NextResponse.json(
        { error: 'Could not extract content from this URL' },
        { status: 400 }
      );
    }

    // Calculate reading time
    const wordCount = article.textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return NextResponse.json({
      success: true,
      title: article.title,
      byline: article.byline,
      content: article.content, // HTML content
      textContent: article.textContent, // Plain text for search
      length: article.length,
      excerpt: article.excerpt,
      siteName: article.siteName,
      readingTime,
    });
  } catch (error) {
    console.error('Error extracting content:', error);
    return NextResponse.json(
      {
        error: 'Failed to extract content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
