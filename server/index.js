const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Database connection with SSL for production
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'loder',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Routes
// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get equipment listings with optional filters
app.get('/api/equipment', async (req, res) => {
  try {
    const { category, search, location, listing_type } = req.query;
    let query = 'SELECT e.*, c.name as category_name FROM equipment e LEFT JOIN categories c ON e.category_id = c.id WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND e.category_id = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (search) {
      query += ` AND (e.title ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (location) {
      query += ` AND e.location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
      paramCount++;
    }

    if (listing_type) {
      query += ` AND e.listing_type = $${paramCount}`;
      params.push(listing_type);
      paramCount++;
    }

    query += ' ORDER BY e.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Get single equipment by ID
app.get('/api/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT e.*, c.name as category_name FROM equipment e LEFT JOIN categories c ON e.category_id = c.id WHERE e.id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Create new equipment listing
app.post('/api/equipment', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category_id, 
      listing_type, 
      price, 
      hourly_rate, 
      monthly_rate, 
      daily_rate, 
      location, 
      owner_name, 
      owner_email, 
      owner_phone, 
      images 
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO equipment (title, description, category_id, listing_type, price, hourly_rate, monthly_rate, daily_rate, location, owner_name, owner_email, owner_phone, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        title, 
        description, 
        category_id, 
        listing_type || 'rent', 
        price || null, 
        hourly_rate || null, 
        monthly_rate || null, 
        daily_rate || null, 
        location, 
        owner_name, 
        owner_email, 
        owner_phone, 
        JSON.stringify(images || [])
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ error: 'Failed to create equipment listing' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Loder API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

