'use client';

import { useState, useEffect, useCallback } from 'react';
import { articleDB } from '@/lib/db';
import type { Article } from '@/types/article';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      const allArticles = await articleDB.getAll();
      // Sort by published date, newest first
      allArticles.sort((a, b) =>
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      );
      setArticles(allArticles);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const refreshArticles = useCallback(() => {
    return loadArticles();
  }, [loadArticles]);

  const updateArticle = useCallback(async (article: Article) => {
    try {
      await articleDB.update(article);
      await refreshArticles();
    } catch (err) {
      console.error('Error updating article:', err);
      throw err;
    }
  }, [refreshArticles]);

  const toggleRead = useCallback(async (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    await updateArticle({
      ...article,
      isRead: !article.isRead,
      lastReadDate: !article.isRead ? new Date() : article.lastReadDate,
    });
  }, [articles, updateArticle]);

  const toggleStar = useCallback(async (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;

    await updateArticle({
      ...article,
      isStarred: !article.isStarred,
    });
  }, [articles, updateArticle]);

  return {
    articles,
    loading,
    error,
    refreshArticles,
    updateArticle,
    toggleRead,
    toggleStar,
  };
}
