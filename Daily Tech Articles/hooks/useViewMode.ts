'use client';

import { useState, useEffect } from 'react';
import type { ViewMode } from '@/types/view-mode';

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>('chronological');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved view mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('viewMode');
    if (saved && isValidViewMode(saved)) {
      setViewMode(saved as ViewMode);
    }
    setIsLoading(false);
  }, []);

  // Persist view mode to localStorage
  const updateViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  return { viewMode, setViewMode: updateViewMode, isLoading };
}

function isValidViewMode(value: string): boolean {
  return ['chronological', 'by-source', 'by-category', 'read-later'].includes(value);
}
