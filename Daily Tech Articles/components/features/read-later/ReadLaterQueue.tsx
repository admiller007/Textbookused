'use client';

import { ArticleCard } from '../article-list/ArticleCard';
import { BookmarkX } from 'lucide-react';
import type { Article } from '@/types/article';

interface ReadLaterQueueProps {
  articles: Article[];
  onToggleRead: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export function ReadLaterQueue({ articles, onToggleRead, onToggleStar }: ReadLaterQueueProps) {
  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4 max-w-md">
          <BookmarkX className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700" strokeWidth={1} />
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-gray-900 dark:text-gray-100">
              No Saved Articles
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              Articles you save will appear here for easy access later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total reading time
  const totalReadingTime = articles.reduce(
    (sum, article) => sum + (article.readingTime || 0),
    0
  );

  return (
    <div className="space-y-0">
      <div className="mb-8">
        <h2 className="text-3xl font-serif italic text-gray-900 dark:text-gray-100 mb-2">
          Reading Queue
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <span className="uppercase tracking-widest">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </span>
          {totalReadingTime > 0 && (
            <>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <span className="uppercase tracking-widest">
                {totalReadingTime} min total
              </span>
            </>
          )}
        </div>
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
