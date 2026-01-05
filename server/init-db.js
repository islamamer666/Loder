const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement) {
        try {
          await pool.query(statement);
          console.log('Executed statement successfully');
        } catch (err) {
          // Ignore errors for statements that might already exist (like CREATE TABLE IF NOT EXISTS)
          if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
            console.warn('Statement warning:', err.message);
          }
        }
      }
    }
    
    console.log('Database initialized successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    await pool.end();
    process.exit(1);
  }
}

initializeDatabase();

