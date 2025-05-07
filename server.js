const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://tmapp_iaoy_user:E5w5fOE55VGsqGvsXOcAi7QETNeQmnCf@dpg-d0dpvcqli9vc73a2rjjg-a.singapore-postgres.render.com/tmapp_iaoy',
  ssl: { rejectUnauthorized: false } // Required for Render's external connection
});

// Create tables for different categories
const initializeTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
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
        id SERIAL PRIMARY KEY,
        name TEXT,
        location TEXT,
        pricePerNight TEXT,
        amenities TEXT,
        facebookLink TEXT,
        telegramLink TEXT
      );

      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name TEXT,
        cuisineType TEXT,
        location TEXT,
        priceRange TEXT,
        facebookLink TEXT,
        telegramLink TEXT
      );

      CREATE TABLE IF NOT EXISTS travel (
        id SERIAL PRIMARY KEY,
        destination TEXT,
        travelType TEXT,
        duration TEXT,
        price TEXT,
        facebookLink TEXT,
        telegramLink TEXT
      );

      CREATE TABLE IF NOT EXISTS identity (
        id SERIAL PRIMARY KEY,
        name TEXT,
        documentType TEXT,
        location TEXT,
        price TEXT,
        facebookLink TEXT,
        telegramLink TEXT
      );
    `);
    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

// Initialize tables on server start
initializeTables();

// Jobs Endpoints
app.get('/api/jobs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/jobs', async (req, res) => {
  const { name, pinkCard, speakThai, paymentMethod, dailySalary, monthlySalary, accommodation, facebookLink, telegramLink } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO jobs (name, pinkCard, speakThai, paymentMethod, dailySalary, monthlySalary, accommodation, facebookLink, telegramLink)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
      `,
      [name, pinkCard, speakThai, paymentMethod, dailySalary, monthlySalary, accommodation, facebookLink, telegramLink]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error posting job:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Hotels Endpoints
app.get('/api/hotels', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hotels');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching hotels:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/hotels', async (req, res) => {
  const { name, location, pricePerNight, amenities, facebookLink, telegramLink } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO hotels (name, location, pricePerNight, amenities, facebookLink, telegramLink)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [name, location, pricePerNight, amenities, facebookLink, telegramLink]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error posting hotel:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Restaurants Endpoints
app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/restaurants', async (req, res) => {
  const { name, cuisineType, location, priceRange, facebookLink, telegramLink } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO restaurants (name, cuisineType, location, priceRange, facebookLink, telegramLink)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [name, cuisineType, location, priceRange, facebookLink, telegramLink]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error posting restaurant:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Travel Endpoints
app.get('/api/travel', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM travel');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching travel:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/travel', async (req, res) => {
  const { destination, travelType, duration, price, facebookLink, telegramLink } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO travel (destination, travelType, duration, price, facebookLink, telegramLink)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [destination, travelType, duration, price, facebookLink, telegramLink]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error posting travel:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Identity Endpoints
app.get('/api/identity', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM identity');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching identity:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/identity', async (req, res) => {
  const { name, documentType, location, price, facebookLink, telegramLink } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO identity (name, documentType, location, price, facebookLink, telegramLink)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [name, documentType, location, price, facebookLink, telegramLink]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error posting identity:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});