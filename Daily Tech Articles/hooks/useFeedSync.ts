'use client';

import { useState, useCallback } from 'react';
import { articleDB, sourceDB } from '@/lib/db';
import type { Source } from '@/types/source';
import type { Article } from '@/types/article';

// Rate limiting for content extraction
const CONCURRENT_EXTRACTIONS = 3;
const EXTRACTION_DELAY = 500; // ms between batches
const EXTRACTION_TIMEOUT = 10000; // 10s timeout per article

export function useFeedSync() {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentSource, setCurrentSource] = useState<string | undefined>();
  const [extracting, setExtracting] = useState(0); // Count of articles being extracted

  // Extract full content from article URL
  const extractContentInBackground = useCallback(async (articleId: string, url: string) => {
    try {
      setExtracting(prev => prev + 1);

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), EXTRACTION_TIMEOUT);

      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Extraction failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to extract content');
      }

      // Update article with extracted content
      const article = await articleDB.getById(articleId);
      if (article) {
        await articleDB.update({
          ...article,
          fullContent: data.textContent, // Store plain text for search
          readingTime: data.readingTime,
        });
        console.log(`  📄 Extracted content from: ${article.title.substring(0, 50)}...`);
      }
    } catch (err) {
      // Log error but don't block - article is still usable without full content
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn(`  ⏱️  Extraction timeout for: ${url}`);
      } else {
        console.warn(`  ⚠️  Failed to extract ${url}:`, err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      setExtracting(prev => prev - 1);
    }
  }, []);

  // Batch extract content with rate limiting
  const batchExtractContent = useCallback(async (articles: Array<{ id: string; url: string }>) => {
    const batches: Array<typeof articles> = [];

    // Split into batches of CONCURRENT_EXTRACTIONS
    for (let i = 0; i < articles.length; i += CONCURRENT_EXTRACTIONS) {
      batches.push(articles.slice(i, i + CONCURRENT_EXTRACTIONS));
    }

    // Process batches with delay
    for (const batch of batches) {
      await Promise.all(
        batch.map(article => extractContentInBackground(article.id, article.url))
      );

      // Delay between batches (except for last batch)
      if (batch !== batches[batches.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, EXTRACTION_DELAY));
      }
    }
  }, [extractContentInBackground]);

  const syncSource = useCallback(async (source: Source): Promise<Article[]> => {
    try {
      console.log(`📡 Fetching ${source.name}...`);

      const response = await fetch('/api/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedUrl: source.url,
          sourceId: source.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      console.log(`✅ ${source.name}: ${data.articles.length} articles`);

      // Update source's last fetch status
      await sourceDB.update({
        ...source,
        lastFetchDate: new Date(),
        lastFetchStatus: 'success',
        errorMessage: undefined,
      });

      return data.articles;
    } catch (err) {
      // Update source with error status
      await sourceDB.update({
        ...source,
        lastFetchDate: new Date(),
        lastFetchStatus: 'error',
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
      });

      throw err;
    }
  }, []);

  const syncAll = useCallback(async (): Promise<number> => {
    setSyncing(true);
    setError(null);
    setProgress(0);
    setCurrentSource(undefined);

    console.log('🔄 Starting sync...');

    try {
      const enabledSources = await sourceDB.getEnabled();
      if (enabledSources.length === 0) {
        throw new Error('No enabled sources');
      }

      console.log(`📋 Syncing ${enabledSources.length} sources:`, enabledSources.map(s => s.name).join(', '));

      let totalArticles = 0;
      const articlesToExtract: Array<{ id: string; url: string }> = [];

      for (let i = 0; i < enabledSources.length; i++) {
        const source = enabledSources[i];
        setCurrentSource(source.name);
        setProgress(((i) / enabledSources.length) * 100);

        try {
          const articles = await syncSource(source);

          // Add articles to database (skip duplicates)
          let newArticles = 0;
          for (const article of articles) {
            const existing = await articleDB.getById(article.id);
            if (!existing) {
              await articleDB.add(article);
              totalArticles++;
              newArticles++;

              // Queue article for content extraction
              articlesToExtract.push({ id: article.id, url: article.url });
            }
          }

          if (newArticles > 0) {
            console.log(`  💾 Added ${newArticles} new articles from ${source.name}`);
          } else {
            console.log(`  ℹ️  No new articles from ${source.name}`);
          }
        } catch (err) {
          console.error(`❌ Error syncing ${source.name}:`, err);
          // Continue with other sources
        }
      }

      // Extract content from all new articles in background
      if (articlesToExtract.length > 0) {
        console.log(`📄 Starting content extraction for ${articlesToExtract.length} articles...`);
        // Don't await - let it run in background
        batchExtractContent(articlesToExtract).catch(err => {
          console.error('Error during batch extraction:', err);
        });
      }

      setProgress(100);
      console.log(`🎉 Sync complete! Added ${totalArticles} new articles`);
      return totalArticles;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync feeds');
      throw err;
    } finally {
      setSyncing(false);
      setCurrentSource(undefined);
      setProgress(0);
    }
  }, [syncSource]);

  return {
    syncing,
    progress,
    error,
    currentSource,
    extracting,
    syncAll,
    syncSource,
  };
}
