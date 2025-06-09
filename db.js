// db.js
const Database = require('better-sqlite3');
const db = new Database('database.sqlite');

// Create users table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phoneNumber TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).run();
db.prepare(`
  CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  schoolName TEXT,
  bloodGroup TEXT,
  fatherName TEXT,
  motherName TEXT,
  parentContact TEXT,
  addressOne TEXT,
  addressTwo TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  emergencyContact TEXT,
  grade TEXT,
  userId INTEGER NOT NULL,
  location TEXT,
  imageURL TEXT
)
`).run();

module.exports = db;