export type ViewMode = 'chronological' | 'by-source' | 'by-category' | 'read-later';

export interface UserPreferences {
  viewMode: ViewMode;
  theme: 'light' | 'dark' | 'auto';
  articlesPerPage: number;
  autoMarkAsRead: boolean;
  defaultAnnotationColor: string;
}
