import db from './database';

export const initDatabase = async () => {
    console.log('[initDatabase] Starting database initialization...');
    try {
        await db.execAsync(async (tx: { executeSqlAsync: (query: string) => any }) => {
            console.log('[initDatabase] Inside execAsync transaction');
            await tx.executeSqlAsync(`
                CREATE TABLE IF NOT EXISTS patients (
                  id TEXT PRIMARY KEY NOT NULL,
                  first_name TEXT,
                  last_name TEXT,
                  email TEXT,
                  phone TEXT,
                  date_of_birth TEXT,
                  photo TEXT,
                  notes TEXT,
                  sync INTEGER,
                  is_deleted INTEGER DEFAULT 0,
                  created_at TEXT,
                  updated_at TEXT
                );
              `);
            console.log('[initDatabase] SQL executed successfully');
        });
        console.log('[initDatabase] Database initialized ✅');
    } catch (error) {
        console.error('[initDatabase] ❌ Error initializing database:', error);
    }

        // await tx.executeSqlAsync(`
        //     CREATE TABLE IF NOT EXISTS form_answers
        //     (
        //         id
        //         TEXT
        //         PRIMARY
        //         KEY
        //         NOT
        //         NULL,
        //         patient_id
        //         TEXT,
        //         form_id
        //         TEXT,
        //         question_id
        //         TEXT,
        //         answer
        //         TEXT,
        //         sync
        //         INTEGER,
        //         is_deleted
        //         INTEGER
        //         DEFAULT
        //         0,
        //         created_at
        //         TEXT,
        //         updated_at
        //         TEXT
        //     );
        // `);
        //
        // await tx.executeSqlAsync(`
        //     CREATE TABLE IF NOT EXISTS visits
        //     (
        //         id
        //         TEXT
        //         PRIMARY
        //         KEY
        //         NOT
        //         NULL,
        //         patient_id
        //         TEXT,
        //         date
        //         TEXT,
        //         notes
        //         TEXT,
        //         services
        //         TEXT,
        //         used_products
        //         TEXT,
        //         sold_products
        //         TEXT,
        //         photos
        //         TEXT,
        //         sync
        //         INTEGER,
        //         is_deleted
        //         INTEGER
        //         DEFAULT
        //         0,
        //         created_at
        //         TEXT,
        //         updated_at
        //         TEXT
        //     );
        // `);
        //
        // await tx.executeSqlAsync(`
        //     CREATE TABLE IF NOT EXISTS forms
        //     (
        //         id
        //         TEXT
        //         PRIMARY
        //         KEY
        //         NOT
        //         NULL,
        //         title
        //         TEXT,
        //         sync
        //         INTEGER,
        //         created_at
        //         TEXT,
        //         updated_at
        //         TEXT
        //     );
        // `);
        //
        // await tx.executeSqlAsync(`
        //     CREATE TABLE IF NOT EXISTS form_questions
        //     (
        //         id
        //         TEXT
        //         PRIMARY
        //          KEY
        //         NOT
        //         NULL,
        //         form_id
        //         TEXT,
        //         question
        //         TEXT,
        //         sync
        //         INTEGER,
        //         created_at
        //         TEXT,
        //         updated_at
        //         TEXT
        //     );
        // `);
        //
        // await tx.executeSqlAsync(`
        //     CREATE TABLE IF NOT EXISTS services
        //     (
        //         id
        //         TEXT
        //         PRIMARY
        //         KEY
        //         NOT
        //         NULL,
        //         name
        //         TEXT,
        //         duration
        //         INTEGER,
        //         description
        //         TEXT,
        //         price
        //         REAL,
        //         sale_price
        //         REAL,
        //         sync
        //         INTEGER,
        //         is_deleted
        //         INTEGER
        //         DEFAULT
        //         0,
        //         created_at
        //         TEXT,
        //         updated_at
        //         TEXT
        //     );
        // `);
        //
        // await tx.executeSqlAsync(`
        //     CREATE TABLE IF NOT EXISTS products
        //     (
        //         id
        //         TEXT
        //         PRIMARY
        //         KEY
        //         NOT
        //         NULL,
        //         name
        //         TEXT,
        //         description
        //         TEXT,
        //         price
        //         REAL,
        //         sale_price
        //         REAL,
        //         sync
        //         INTEGER,
        //         is_deleted
        //         INTEGER
        //         DEFAULT
        //         0,
        //         created_at
        //         TEXT,
        //         updated_at
        //         TEXT
        //     );
        // `);
    // })
};
