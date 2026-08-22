const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DATA_DIR = path.join(__dirname, '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'undangan.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  db.exec(schema);
  const { c } = db.prepare('SELECT COUNT(*) AS c FROM users').get();
  if (c === 0) {
    require('../database/seed')(db);
  }
}

module.exports = { db, initDb };
