'use client';

import { useMemo } from 'react';
import { ArticleCard } from './ArticleCard';
import type { Article } from '@/types/article';

interface CategorizedArticleListProps {
  articles: Article[];
  onToggleRead: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export function CategorizedArticleList({ articles, onToggleRead, onToggleStar }: CategorizedArticleListProps) {
  const categorized = useMemo(() => {
    const categories: Record<string, Article[]> = {};

    articles.forEach((article) => {
      if (article.category && article.category.length > 0) {
        article.category.forEach((cat) => {
          if (!categories[cat]) {
            categories[cat] = [];
          }
          categories[cat].push(article);
        });
      } else {
        // Uncategorized
        if (!categories['Uncategorized']) {
          categories['Uncategorized'] = [];
        }
        categories['Uncategorized'].push(article);
      }
    });

    return categories;
  }, [articles]);

  return (
    <div className="space-y-16">
      {Object.entries(categorized).map(([category, categoryArticles]) => (
        <section key={category} className="space-y-0">
          <div className="mb-8 pb-4 border-b-2 border-gray-900 dark:border-gray-100">
            <h2 className="text-3xl font-serif italic text-gray-900 dark:text-gray-100">
              {category}
            </h2>
            <p className="text-gray-400 dark:text-gray-600 text-sm mt-2 uppercase tracking-widest">
              {categoryArticles.length} {categoryArticles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>

          <div className="space-y-0">
            {categoryArticles.map((article) => (
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
