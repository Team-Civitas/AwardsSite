import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve("./data/awards.db");
const db = new Database(dbPath);

// Skapa tabeller om de inte finns
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    rarity TEXT
  );

  CREATE TABLE IF NOT EXISTS user_badges (
    user_id TEXT NOT NULL,
    badge_id TEXT NOT NULL,
    granted_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (badge_id) REFERENCES badges(id)
  );
`);

// Safe migration: add avatar column if missing
const columns = db.prepare(`PRAGMA table_info(users)`).all();
const hasAvatar = columns.some(col => col.name === "avatar");

if (!hasAvatar) {
  db.exec(`ALTER TABLE users ADD COLUMN avatar TEXT`);
}

export default db;
