'use client';

import { ArticleCard } from './ArticleCard';
import type { Article } from '@/types/article';

interface ArticleListProps {
  articles: Article[];
  onToggleRead: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export function ArticleList({ articles, onToggleRead, onToggleStar }: ArticleListProps) {
  return (
    <div className="space-y-0">
      <div className="mb-8">
        <h2 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-500 font-medium">
          Latest Articles
        </h2>
        <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'}
        </p>
      </div>

      <div className="space-y-0">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onToggleRead={onToggleRead}
            onToggleStar={onToggleStar}
          />
        ))}
      </div>
    </div>
  );
}
