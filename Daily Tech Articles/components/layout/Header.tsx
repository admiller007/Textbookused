'use client';

import { RefreshCw } from 'lucide-react';
import type { ViewMode } from '@/types/view-mode';
import { SearchBar } from '@/components/features/search-filter/SearchBar';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSync: () => void;
  syncing: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  isSearching?: boolean;
  searchResultCount?: number;
}

const VIEW_MODES: { value: ViewMode; label: string }[] = [
  { value: 'chronological', label: 'Latest' },
  { value: 'by-source', label: 'By Source' },
  { value: 'by-category', label: 'By Topic' },
  { value: 'read-later', label: 'Saved' },
];

export function Header({
  viewMode,
  onViewModeChange,
  onSync,
  syncing,
  searchQuery = '',
  onSearchQueryChange,
  isSearching = false,
  searchResultCount,
}: HeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between gap-4 py-6">
          {/* Logo */}
          <div className="flex items-baseline gap-3 flex-shrink-0">
            <h1 className="text-4xl font-serif italic text-gray-900 dark:text-gray-100 tracking-tight">
              Pulse
            </h1>
            <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-500 font-medium hidden sm:inline">
              Tech Reader
            </span>
          </div>

          {/* Search Bar - Desktop */}
          {onSearchQueryChange && (
            <div className="hidden md:block flex-1 max-w-md">
              <SearchBar
                query={searchQuery}
                onQueryChange={onSearchQueryChange}
                isSearching={isSearching}
                resultCount={searchResultCount}
              />
            </div>
          )}

          {/* View Mode Switcher */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-sm">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => onViewModeChange(mode.value)}
                className={`
                  px-4 py-2 text-sm font-medium tracking-wide transition-all rounded-sm
                  ${
                    viewMode === mode.value
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                {mode.label}
              </button>
            ))}
          </nav>

          {/* Sync Button */}
          <button
            onClick={onSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-500 transition-colors disabled:opacity-50 group flex-shrink-0"
            title="Sync feeds"
          >
            <RefreshCw
              className={`w-4 h-4 transition-transform group-hover:rotate-180 ${
                syncing ? 'animate-spin' : ''
              }`}
            />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>

        {/* Search Bar - Mobile */}
        {onSearchQueryChange && (
          <div className="md:hidden pb-4">
            <SearchBar
              query={searchQuery}
              onQueryChange={onSearchQueryChange}
              isSearching={isSearching}
              resultCount={searchResultCount}
            />
          </div>
        )}

        {/* Mobile View Mode Selector */}
        <div className="md:hidden pb-4 flex gap-2 overflow-x-auto">
          {VIEW_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onViewModeChange(mode.value)}
              className={`
                px-4 py-2 text-sm font-medium tracking-wide transition-all rounded-sm whitespace-nowrap
                ${
                  viewMode === mode.value
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                }
              `}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
