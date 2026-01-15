'use client';

import { useMemo } from 'react';
import { ArticleCard } from './ArticleCard';
import type { Article } from '@/types/article';

interface GroupedArticleListProps {
  articles: Article[];
  onToggleRead: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export function GroupedArticleList({ articles, onToggleRead, onToggleStar }: GroupedArticleListProps) {
  const grouped = useMemo(() => {
    const groups: Record<string, Article[]> = {};

    articles.forEach((article) => {
      if (!groups[article.sourceId]) {
        groups[article.sourceId] = [];
      }
      groups[article.sourceId].push(article);
    });

    return groups;
  }, [articles]);

  const sourceNames: Record<string, string> = {
    'hacker-news': 'Hacker News',
    'techcrunch': 'TechCrunch',
    'ars-technica': 'Ars Technica',
    'the-verge': 'The Verge',
  };

  return (
    <div className="space-y-16">
      {Object.entries(grouped).map(([sourceId, sourceArticles]) => (
        <section key={sourceId} className="space-y-0">
          <div className="mb-8 pb-4 border-b-2 border-gray-900 dark:border-gray-100">
            <h2 className="text-3xl font-serif italic text-gray-900 dark:text-gray-100">
              {sourceNames[sourceId] || sourceId}
            </h2>
            <p className="text-gray-400 dark:text-gray-600 text-sm mt-2 uppercase tracking-widest">
              {sourceArticles.length} {sourceArticles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>

          <div className="space-y-0">
            {sourceArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onToggleRead={onToggleRead}
                onToggleStar={onToggleStar}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
