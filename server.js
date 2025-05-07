const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

// Initialize SQLite database with a path suitable for local and deployed environments
const dbPath = process.env.NODE_ENV === 'production' ? '/opt/render/data/app.db' : path.join(__dirname, 'app.db');
const db = new Database(dbPath, { verbose: console.log });

// Create tables for different categories
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    pinkCard TEXT,
    speakThai TEXT,
    paymentMethod TEXT,
    dailySalary TEXT,
    monthlySalary TEXT,
    accommodation TEXT,
    facebookLink TEXT,
    telegramLink TEXT
  );

  CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    location TEXT,
    pricePerNight TEXT,
    amenities TEXT,
    facebookLink TEXT,
    telegramLink TEXT
  );

  CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    cuisineType TEXT,
    location TEXT,
    priceRange TEXT,
    facebookLink TEXT,
    telegramLink TEXT
  );

  CREATE TABLE IF NOT EXISTS travel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination TEXT,
    travelType TEXT,
    duration TEXT,
    price TEXT,
    facebookLink TEXT,
    telegramLink TEXT
  );

  CREATE TABLE IF NOT EXISTS identity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    documentType TEXT,
    location TEXT,
    price TEXT,
    facebookLink TEXT,
    telegramLink TEXT
  );
`);

// Jobs Endpoints
app.get('/api/jobs', (req, res) => {
  const jobs = db.prepare('SELECT * FROM jobs').all();
  res.json(jobs);
});

app.post('/api/jobs', (req, res) => {
  const { name, pinkCard, speakThai, paymentMethod, dailySalary, monthlySalary, accommodation, facebookLink, telegramLink } = req.body;
  // The '?' placeholders are used to safely insert values, preventing SQL injection
  const result = db.prepare(`
    INSERT INTO jobs (name, pinkCard, speakThai, paymentMethod, dailySalary, monthlySalary, accommodation, facebookLink, telegramLink)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, pinkCard, speakThai, paymentMethod, dailySalary, monthlySalary, accommodation, facebookLink, telegramLink);
  res.json({ id: result.lastInsertRowid });
});

// Hotels Endpoints
app.get('/api/hotels', (req, res) => {
  const hotels = db.prepare('SELECT * FROM hotels').all();
  res.json(hotels);
});

app.post('/api/hotels', (req, res) => {
  const { name, location, pricePerNight, amenities, facebookLink, telegramLink } = req.body;
  const result = db.prepare(`
    INSERT INTO hotels (name, location, pricePerNight, amenities, facebookLink, telegramLink)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, location, pricePerNight, amenities, facebookLink, telegramLink);
  res.json({ id: result.lastInsertRowid });
});

// Restaurants Endpoints
app.get('/api/restaurants', (req, res) => {
  const restaurants = db.prepare('SELECT * FROM restaurants').all();
  res.json(restaurants);
});

app.post('/api/restaurants', (req, res) => {
  const { name, cuisineType, location, priceRange, facebookLink, telegramLink } = req.body;
  const result = db.prepare(`
    INSERT INTO restaurants (name, cuisineType, location, priceRange, facebookLink, telegramLink)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, cuisineType, location, priceRange, facebookLink, telegramLink);
  res.json({ id: result.lastInsertRowid });
});

// Travel Endpoints
app.get('/api/travel', (req, res) => {
  const travel = db.prepare('SELECT * FROM travel').all();
  res.json(travel);
});

app.post('/api/travel', (req, res) => {
  const { destination, travelType, duration, price, facebookLink, telegramLink } = req.body;
  const result = db.prepare(`
    INSERT INTO travel (destination, travelType, duration, price, facebookLink, telegramLink)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(destination, travelType, duration, price, facebookLink, telegramLink);
  res.json({ id: result.lastInsertRowid });
});

// Identity Endpoints
app.get('/api/identity', (req, res) => {
  const identity = db.prepare('SELECT * FROM identity').all();
  res.json(identity);
});

app.post('/api/identity', (req, res) => {
  const { name, documentType, location, price, facebookLink, telegramLink } = req.body;
  const result = db.prepare(`
    INSERT INTO identity (name, documentType, location, price, facebookLink, telegramLink)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, documentType, location, price, facebookLink, telegramLink);
  res.json({ id: result.lastInsertRowid });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});