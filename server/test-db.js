const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default database first
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function setupDatabase() {
  try {
    // Check if database exists
    const dbCheck = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'loder'"
    );
    
    if (dbCheck.rows.length === 0) {
      console.log('Creating database "loder"...');
      await pool.query('CREATE DATABASE loder');
      console.log('Database created successfully');
    } else {
      console.log('Database "loder" already exists');
    }
    
    // Now connect to the loder database
    pool.end();
    const loderPool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: 'loder',
      password: process.env.DB_PASSWORD || 'postgres',
      port: process.env.DB_PORT || 5432,
    });
    
    // Read and execute schema
    const schema = fs.readFileSync('./database/schema.sql', 'utf8');
    await loderPool.query(schema);
    console.log('Schema applied successfully');
    
    // Test connection
    const result = await loderPool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    
    await loderPool.end();
    process.exit(0);
  } catch (error) {
    console.error('Database setup error:', error.message);
    process.exit(1);
  }
}

setupDatabase();

