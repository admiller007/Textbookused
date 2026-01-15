import { openDB, IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, STORE_CONFIG, DBSchema } from './schema';
import type { Article } from '@/types/article';
import type { Annotation } from '@/types/annotation';
import type { Source } from '@/types/source';

let dbInstance: IDBPDatabase<DBSchema> | null = null;

export async function getDB(): Promise<IDBPDatabase<DBSchema>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<DBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Create articles store
      if (!db.objectStoreNames.contains('articles')) {
        const articleStore = db.createObjectStore('articles', {
          keyPath: STORE_CONFIG.articles.keyPath,
        });

        STORE_CONFIG.articles.indexes.forEach(index => {
          articleStore.createIndex(index.name, index.keyPath, index.options);
        });
      }

      // Create annotations store
      if (!db.objectStoreNames.contains('annotations')) {
        const annotationStore = db.createObjectStore('annotations', {
          keyPath: STORE_CONFIG.annotations.keyPath,
        });

        STORE_CONFIG.annotations.indexes.forEach(index => {
          annotationStore.createIndex(index.name, index.keyPath, index.options);
        });
      }

      // Create sources store
      if (!db.objectStoreNames.contains('sources')) {
        const sourceStore = db.createObjectStore('sources', {
          keyPath: STORE_CONFIG.sources.keyPath,
        });

        STORE_CONFIG.sources.indexes.forEach(index => {
          sourceStore.createIndex(index.name, index.keyPath, index.options);
        });
      }
    },
  });

  return dbInstance;
}

// Article operations
export const articleDB = {
  async getAll(): Promise<Article[]> {
    const db = await getDB();
    return db.getAll('articles');
  },

  async getById(id: string): Promise<Article | undefined> {
    const db = await getDB();
    return db.get('articles', id);
  },

  async getBySource(sourceId: string): Promise<Article[]> {
    const db = await getDB();
    return db.getAllFromIndex('articles', 'by-sourceId', sourceId);
  },

  async getStarred(): Promise<Article[]> {
    const db = await getDB();
    const allArticles = await db.getAll('articles');
    return allArticles.filter(article => article.isStarred === true);
  },

  async getUnread(): Promise<Article[]> {
    const db = await getDB();
    const allArticles = await db.getAll('articles');
    return allArticles.filter(article => article.isRead === false);
  },

  async add(article: Article): Promise<string> {
    const db = await getDB();
    return db.add('articles', article);
  },

  async addBulk(articles: Article[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('articles', 'readwrite');
    await Promise.all([
      ...articles.map(article => tx.store.add(article)),
      tx.done,
    ]);
  },

  async update(article: Article): Promise<string> {
    const db = await getDB();
    return db.put('articles', article);
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('articles', id);
  },

  async clear(): Promise<void> {
    const db = await getDB();
    await db.clear('articles');
  },
};

// Annotation operations
export const annotationDB = {
  async getAll(): Promise<Annotation[]> {
    const db = await getDB();
    return db.getAll('annotations');
  },

  async getById(id: string): Promise<Annotation | undefined> {
    const db = await getDB();
    return db.get('annotations', id);
  },

  async getByArticle(articleId: string): Promise<Annotation[]> {
    const db = await getDB();
    return db.getAllFromIndex('annotations', 'by-articleId', articleId);
  },

  async add(annotation: Annotation): Promise<string> {
    const db = await getDB();
    return db.add('annotations', annotation);
  },

  async update(annotation: Annotation): Promise<string> {
    const db = await getDB();
    return db.put('annotations', annotation);
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('annotations', id);
  },

  async deleteByArticle(articleId: string): Promise<void> {
    const db = await getDB();
    const annotations = await this.getByArticle(articleId);
    const tx = db.transaction('annotations', 'readwrite');
    await Promise.all([
      ...annotations.map(annotation => tx.store.delete(annotation.id)),
      tx.done,
    ]);
  },
};

// Source operations
export const sourceDB = {
  async getAll(): Promise<Source[]> {
    const db = await getDB();
    return db.getAll('sources');
  },

  async getEnabled(): Promise<Source[]> {
    const db = await getDB();
    const allSources = await db.getAll('sources');
    return allSources.filter(source => source.isEnabled === true);
  },

  async getById(id: string): Promise<Source | undefined> {
    const db = await getDB();
    return db.get('sources', id);
  },

  async add(source: Source): Promise<string> {
    const db = await getDB();
    return db.add('sources', source);
  },

  async addBulk(sources: Source[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('sources', 'readwrite');
    await Promise.all([
      ...sources.map(source => tx.store.add(source)),
      tx.done,
    ]);
  },

  async update(source: Source): Promise<string> {
    const db = await getDB();
    return db.put('sources', source);
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('sources', id);
  },
};

// Utility to generate unique IDs
export function generateId(url: string, date: Date | string): string {
  const dateStr = typeof date === 'string' ? date : date.toISOString();
  const combined = `${url}-${dateStr}`;

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36);
}
