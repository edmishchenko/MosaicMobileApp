import { Platform } from 'react-native';

let db: any;

if (Platform.OS === 'web') {
  // Use a web-compatible storage solution
  // You could use IndexedDB or localStorage instead
  console.warn('SQLite not supported on web, using fallback storage');
  db = null; // or implement a web-compatible alternative
} else {
  // Use SQLite for mobile platforms
  const { openDatabaseSync } = require('expo-sqlite');
  db = openDatabaseSync('beauty.db');
}

export default db;