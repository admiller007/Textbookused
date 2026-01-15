'use client';

import { useState } from 'react';
import { Star, Circle, Clock, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
  onToggleRead: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export function ArticleCard({ article, onToggleRead, onToggleStar }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);

  const timeAgo = formatDistanceToNow(new Date(article.publishedDate), { addSuffix: true });

  return (
    <article
      className={`
        group relative border-b border-gray-200 dark:border-gray-800 py-8
        transition-all duration-300 hover:bg-gray-50/50 dark:hover:bg-gray-900/30
        ${article.isRead ? 'opacity-60' : ''}
      `}
    >
      <div className="flex gap-6">
        {/* Article Image */}
        {article.imageUrl && !imageError && (
          <div className="hidden sm:block w-32 h-32 flex-shrink-0 overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-900">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Title */}
          <h2 className="text-2xl font-serif leading-tight text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline decoration-2 underline-offset-4"
            >
              {article.title}
            </a>
          </h2>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-500 dark:text-gray-500 font-medium">
            <span>{article.sourceId.replace('-', ' ')}</span>
            {article.author && (
              <>
                <span className="text-gray-300 dark:text-gray-700">·</span>
                <span>{article.author}</span>
              </>
            )}
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span>{timeAgo}</span>
            {article.readingTime && (
              <>
                <span className="text-gray-300 dark:text-gray-700">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readingTime} min
                </span>
              </>
            )}
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 font-light">
              {article.excerpt}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => onToggleRead(article.id)}
              className={`
                flex items-center gap-2 text-sm font-medium transition-colors
                ${
                  article.isRead
                    ? 'text-amber-600 dark:text-amber-500'
                    : 'text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400'
                }
              `}
              title={article.isRead ? 'Mark as unread' : 'Mark as read'}
            >
              <Circle
                className="w-4 h-4"
                fill={article.isRead ? 'currentColor' : 'none'}
              />
              <span className="hidden sm:inline">
                {article.isRead ? 'Read' : 'Unread'}
              </span>
            </button>

            <button
              onClick={() => onToggleStar(article.id)}
              className={`
                flex items-center gap-2 text-sm font-medium transition-colors
                ${
                  article.isStarred
                    ? 'text-amber-600 dark:text-amber-500'
                    : 'text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400'
                }
              `}
              title={article.isStarred ? 'Remove from saved' : 'Save for later'}
            >
              <Star
                className="w-4 h-4"
                fill={article.isStarred ? 'currentColor' : 'none'}
              />
              <span className="hidden sm:inline">
                {article.isStarred ? 'Saved' : 'Save'}
              </span>
            </button>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-2 text-sm font-medium text-gray-400 dark:text-gray-600 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            >
              <span className="hidden sm:inline">Read</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
