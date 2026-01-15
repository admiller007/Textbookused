'use client';

import { useEffect, useState, useMemo } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { useViewMode } from '@/hooks/useViewMode';
import { useFeedSync } from '@/hooks/useFeedSync';
import { useSearch } from '@/hooks/useSearch';
import { initializeDatabase } from '@/lib/init-db';
import { Header } from '@/components/layout/Header';
import { ArticleList } from '@/components/features/article-list/ArticleList';
import { GroupedArticleList } from '@/components/features/article-list/GroupedArticleList';
import { CategorizedArticleList } from '@/components/features/article-list/CategorizedArticleList';
import { ReadLaterQueue } from '@/components/features/read-later/ReadLaterQueue';
import { RefreshCw, Inbox, Database, Download } from 'lucide-react';

export default function HomePage() {
  const { articles, loading, refreshArticles, toggleRead, toggleStar } = useArticles();
  const { viewMode, setViewMode } = useViewMode();
  const { syncing, syncAll, progress, currentSource } = useFeedSync();
  const { query, setQuery, isSearching, searchArticles, resultCount } = useSearch();
  const [initialized, setInitialized] = useState(false);
  const [initStatus, setInitStatus] = useState<string>('Initializing database...');

  // Apply search to articles
  const filteredArticles = useMemo(() => {
    return searchArticles(articles);
  }, [articles, searchArticles]);

  useEffect(() => {
    const init = async () => {
      try {
        setInitStatus('Setting up database...');
        const wasInitialized = await initializeDatabase();
        setInitialized(true);

        // If database was just initialized, sync feeds
        if (wasInitialized) {
          setInitStatus('Database ready! Fetching latest articles...');
          await syncAll();
          await refreshArticles();
          setInitStatus('');
        } else {
          setInitStatus('');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setInitStatus('Error initializing app');
      }
    };

    init();
  }, []);

  const handleSync = async () => {
    try {
      await syncAll();
      await refreshArticles();
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  const renderView = () => {
    if (loading || !initialized || syncing) {
      return (
        <LoadingState
          status={initStatus}
          syncing={syncing}
          progress={progress}
          currentSource={currentSource}
        />
      );
    }

    if (articles.length === 0) {
      return <EmptyState onSync={handleSync} syncing={syncing} />;
    }

    // Show empty state if search has no results
    if (query && filteredArticles.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 max-w-md">
            <p className="text-2xl">🔍</p>
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              No articles found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No articles match your search for &quot;{query}&quot;
            </p>
            <button
              onClick={() => setQuery('')}
              className="text-amber-600 dark:text-amber-500 hover:underline text-sm"
            >
              Clear search
            </button>
          </div>
        </div>
      );
    }

    switch (viewMode) {
      case 'chronological':
        return (
          <ArticleList
            articles={filteredArticles}
            onToggleRead={toggleRead}
            onToggleStar={toggleStar}
          />
        );
      case 'by-source':
        return (
          <GroupedArticleList
            articles={filteredArticles}
            onToggleRead={toggleRead}
            onToggleStar={toggleStar}
          />
        );
      case 'by-category':
        return (
          <CategorizedArticleList
            articles={filteredArticles}
            onToggleRead={toggleRead}
            onToggleStar={toggleStar}
          />
        );
      case 'read-later':
        return (
          <ReadLaterQueue
            articles={filteredArticles.filter(a => a.isStarred)}
            onToggleRead={toggleRead}
            onToggleStar={toggleStar}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#0a0a0a] transition-colors">
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSync={handleSync}
        syncing={syncing}
        searchQuery={query}
        onSearchQueryChange={setQuery}
        isSearching={isSearching}
        searchResultCount={query ? resultCount : undefined}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {renderView()}
      </main>
    </div>
  );
}

function LoadingState({ status, syncing, progress, currentSource }: {
  status: string;
  syncing: boolean;
  progress: number;
  currentSource?: string;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          {syncing ? (
            <Download className="w-12 h-12 mx-auto text-amber-600 dark:text-amber-500 animate-bounce" />
          ) : (
            <Database className="w-12 h-12 mx-auto text-amber-600 dark:text-amber-500" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-lg text-gray-900 dark:text-gray-100 font-medium tracking-wide">
            {status || 'Loading your articles...'}
          </p>

          {syncing && currentSource && (
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
              Syncing {currentSource}
            </p>
          )}

          {syncing && progress > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-600 dark:bg-amber-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 uppercase tracking-widest">
                {Math.round(progress)}% Complete
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onSync, syncing }: { onSync: () => void; syncing: boolean }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <Inbox className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-700" strokeWidth={1} />
        <div className="space-y-2">
          <h2 className="text-3xl font-serif text-gray-900 dark:text-gray-100">
            No Articles Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            Sync your feeds to start discovering the latest tech news from around the web.
          </p>
        </div>
        <button
          onClick={onSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium tracking-wide transition-colors rounded-sm"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Feeds'}
        </button>
      </div>
    </div>
  );
}
