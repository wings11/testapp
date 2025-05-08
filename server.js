const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

// Initialize PostgreSQL connection pool
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set');
  process.exit(1);
}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create tables for different categories with retry logic
const initializeTables = async (retries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
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
      break; // Exit loop on success
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);
      if (attempt === retries) throw err; // Throw error if all retries fail
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
    }
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

app.delete('/api/jobs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Job not found' });
    } else {
      res.json({ message: 'Job deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting job:', err);
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

app.delete('/api/hotels/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM hotels WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Hotel not found' });
    } else {
      res.json({ message: 'Hotel deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting hotel:', err);
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

app.delete('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM restaurants WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Restaurant not found' });
    } else {
      res.json({ message: 'Restaurant deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting restaurant:', err);
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

app.delete('/api/travel/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM travel WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Travel not found' });
    } else {
      res.json({ message: 'Travel deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting travel:', err);
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

app.delete('/api/identity/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM identity WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Identity not found' });
    } else {
      res.json({ message: 'Identity deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting identity:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});