import db from './database';
import { initDatabase } from './initDb';

// Global flag to track if a database has been initialized
let isDbInitialized = false;

/**
 * Ensures that a specific table exists in the database
 * @param tableName The name of the table to check
 * @returns Promise that resolves when the table exists
 */
export const ensureTable = async (tableName: string): Promise<void> => {
  try {
    // If a database hasn't been initialized yet, initialize it
    if (!isDbInitialized) {
      await initDatabase();
      isDbInitialized = true;
      console.log(`✅ Database initialized by ensureTable`);
    }

    // Check if the table exists
    const result = await db.getAllAsync(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
      [tableName]
    );

    // If a table doesn't exist, initialize the database again
    if (!result || result.length === 0) {
      console.log(`⚠️ Table ${tableName} not found, initializing database again`);
      await initDatabase();
      
      // Check again to make sure the table was created
      const checkAgain = await db.getAllAsync(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
        [tableName]
      );
      
      if (!checkAgain || checkAgain.length === 0) {
        throw new Error(`Failed to create table ${tableName}`);
      }
    }
  } catch (error) {
    console.error(`Error ensuring table ${tableName} exists:`, error);
    throw error;
  }
};

/**
 * Wrapper function to ensure a table exists before executing a database operation
 * @param tableName The name of the table to check
 * @param operation The database operation to execute
 * @returns The result of the operation
 */
export const withTableCheck = async <T>(
  tableName: string,
  operation: () => Promise<T>
): Promise<T> => {
  if (typeof tableName !== 'string') {
    throw new Error('Table name must be a string');
  }
  await ensureTable(tableName);
  return operation();
};