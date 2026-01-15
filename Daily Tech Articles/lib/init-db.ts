import { sourceDB } from './db';
import { DEFAULT_SOURCES } from '@/constants/default-sources';

export async function initializeDatabase() {
  try {
    console.log('🗄️  Checking database...');

    // Check if sources already exist
    const existingSources = await sourceDB.getAll();

    if (existingSources.length === 0) {
      // Add default sources
      console.log('📦 Initializing with default sources:', DEFAULT_SOURCES.map(s => s.name).join(', '));
      await sourceDB.addBulk(DEFAULT_SOURCES);
      console.log('✅ Database initialized successfully');
      return true;
    }

    console.log('✅ Database already initialized with', existingSources.length, 'sources');
    return false;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}
