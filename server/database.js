import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });
const dbPath = process.env.DB_PATH || join(__dirname, 'gym_tracker.db');

const db = new sqlite3.Database(dbPath);

export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(() => {
        let completed = 0;
        const total = 6;

        const checkComplete = (err) => {
          if (err) {
            console.error('Database error:', err);
            reject(err);
          } else {
            completed++;
            if (completed === total) {
              runMigrations(() => {
                console.log('✅ Database tables initialized');
                resolve();
              });
            }
          }
        };

        // Create users table
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT DEFAULT 'owner',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => checkComplete(err));

        // Create clients table
        db.run(`
          CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            subscription_start TEXT NOT NULL,
            subscription_end TEXT NOT NULL,
            subscription_type TEXT NOT NULL,
            status TEXT NOT NULL,
            amount_paid REAL DEFAULT 0,
            amount_due REAL DEFAULT 0,
            payment_mode TEXT DEFAULT 'Cash',
            payment_status TEXT DEFAULT 'unpaid',
            last_visit TEXT,
            notification_sent INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
          )
        `, (err) => checkComplete(err));

        // Create notifications table
        db.run(`
          CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            client_id INTEGER NOT NULL,
            notification_type TEXT NOT NULL,
            message TEXT NOT NULL,
            sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (client_id) REFERENCES clients(id)
          )
        `, (err) => checkComplete(err));

        db.run(`
          CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            client_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            payment_mode TEXT NOT NULL,
            payment_date TEXT NOT NULL,
            note TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (client_id) REFERENCES clients(id)
          )
        `, (err) => checkComplete(err));

        db.run(`
          CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            client_id INTEGER NOT NULL,
            visit_date TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, client_id, visit_date),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (client_id) REFERENCES clients(id)
          )
        `, (err) => checkComplete(err));

        db.run(`
          CREATE TABLE IF NOT EXISTS renewal_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            client_id INTEGER NOT NULL,
            previous_start TEXT,
            previous_end TEXT,
            new_start TEXT NOT NULL,
            new_end TEXT NOT NULL,
            amount_paid REAL DEFAULT 0,
            amount_due REAL DEFAULT 0,
            payment_mode TEXT DEFAULT 'Cash',
            renewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (client_id) REFERENCES clients(id)
          )
        `, (err) => checkComplete(err));
      });
    } catch (error) {
      console.error('Database initialization error:', error);
      reject(error);
    }
  });
}

const clientColumns = [
  ['amount_paid', 'REAL DEFAULT 0'],
  ['amount_due', 'REAL DEFAULT 0'],
  ['payment_mode', "TEXT DEFAULT 'Cash'"],
  ['payment_status', "TEXT DEFAULT 'unpaid'"],
  ['last_visit', 'TEXT']
];

function runMigrations(done) {
  let completed = 0;
  const finish = () => {
    completed++;
    if (completed === clientColumns.length) done();
  };

  clientColumns.forEach(([column, definition]) => {
    db.run(`ALTER TABLE clients ADD COLUMN ${column} ${definition}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Failed to add clients.${column}:`, err.message);
      }
      finish();
    });
  });
}

export default db;
