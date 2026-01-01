'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Article } from '@/types/article';

export interface UseSearchResult {
  query: string;
  setQuery: (q: string) => void;
  debouncedQuery: string;
  isSearching: boolean;
  searchArticles: (articles: Article[]) => Article[];
  resultCount: number;
}

// Debounce delay in milliseconds
const DEBOUNCE_DELAY = 300;

export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  // Debounce search query
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  // Search function with relevance scoring
  const searchArticles = useMemo(() => {
    return (articles: Article[]): Article[] => {
      const normalizedQuery = debouncedQuery.toLowerCase().trim();

      if (!normalizedQuery) {
        setResultCount(articles.length);
        return articles;
      }

      const results = articles
        .map(article => {
          let score = 0;
          const title = article.title.toLowerCase();
          const excerpt = article.excerpt.toLowerCase();
          const content = (article.fullContent || '').toLowerCase();

          // Title matching (highest priority)
          if (title === normalizedQuery) {
            score += 10; // Exact match
          } else if (title.includes(normalizedQuery)) {
            score += 5; // Partial match
          }

          // Excerpt matching
          if (excerpt.includes(normalizedQuery)) {
            score += 3;
          }

          // Full content matching (if available)
          if (content && content.includes(normalizedQuery)) {
            score += 1;
          }

          return { article, score };
        })
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(r => r.article);

      setResultCount(results.length);
      return results;
    };
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    debouncedQuery,
    isSearching,
    searchArticles,
    resultCount,
  };
}
