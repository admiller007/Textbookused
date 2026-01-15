export const DB_NAME = 'TechNewsReader';
export const DB_VERSION = 1;

export interface DBSchema {
  articles: {
    key: string;
    value: any;
    indexes: {
      'by-sourceId': string;
      'by-publishedDate': Date;
      'by-category': string;
      'by-isRead': number;
      'by-isStarred': number;
    };
  };
  annotations: {
    key: string;
    value: any;
    indexes: {
      'by-articleId': string;
      'by-createdDate': Date;
    };
  };
  sources: {
    key: string;
    value: any;
    indexes: {
      'by-type': string;
      'by-isEnabled': number;
    };
  };
}

export const STORE_CONFIG = {
  articles: {
    keyPath: 'id',
    indexes: [
      { name: 'by-sourceId', keyPath: 'sourceId', options: { unique: false } },
      { name: 'by-publishedDate', keyPath: 'publishedDate', options: { unique: false } },
      { name: 'by-category', keyPath: 'category', options: { unique: false, multiEntry: true } },
      { name: 'by-isRead', keyPath: 'isRead', options: { unique: false } },
      { name: 'by-isStarred', keyPath: 'isStarred', options: { unique: false } },
    ]
  },
  annotations: {
    keyPath: 'id',
    indexes: [
      { name: 'by-articleId', keyPath: 'articleId', options: { unique: false } },
      { name: 'by-createdDate', keyPath: 'createdDate', options: { unique: false } },
    ]
  },
  sources: {
    keyPath: 'id',
    indexes: [
      { name: 'by-type', keyPath: 'type', options: { unique: false } },
      { name: 'by-isEnabled', keyPath: 'isEnabled', options: { unique: false } },
    ]
  }
} as const;
