const { Pool } = require('pg');

// External Database URL from Render
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://loder:fYm0xgADYMv6C0noY1RKp7mPJsRq1qXD@dpg-d5dtcddactks73cddipg-a.frankfurt-postgres.render.com/loderdb';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrateDatabase() {
  try {
    console.log('Starting database migration...');
    console.log('Database:', DATABASE_URL.split('@')[1].split('/')[1]);
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful\n');
    
    // Add listing_type column
    console.log('Adding listing_type column...');
    await pool.query(`
      ALTER TABLE equipment 
      ADD COLUMN IF NOT EXISTS listing_type VARCHAR(10) DEFAULT 'rent' CHECK (listing_type IN ('sell', 'rent'))
    `);
    console.log('✓ listing_type column added');
    
    // Add price column (for selling)
    console.log('Adding price column...');
    await pool.query(`
      ALTER TABLE equipment 
      ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2)
    `);
    console.log('✓ price column added');
    
    // Add hourly_rate column (for renting)
    console.log('Adding hourly_rate column...');
    await pool.query(`
      ALTER TABLE equipment 
      ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2)
    `);
    console.log('✓ hourly_rate column added');
    
    // Add monthly_rate column (for renting)
    console.log('Adding monthly_rate column...');
    await pool.query(`
      ALTER TABLE equipment 
      ADD COLUMN IF NOT EXISTS monthly_rate DECIMAL(10, 2)
    `);
    console.log('✓ monthly_rate column added');
    
    // Migrate existing daily_rate to hourly_rate (optional, for backward compatibility)
    console.log('Migrating existing data...');
    await pool.query(`
      UPDATE equipment 
      SET hourly_rate = daily_rate 
      WHERE daily_rate IS NOT NULL AND hourly_rate IS NULL AND listing_type = 'rent'
    `);
    console.log('✓ Existing data migrated');
    
    // Make daily_rate nullable (since we're using hourly/monthly now)
    console.log('Updating daily_rate column...');
    await pool.query(`
      ALTER TABLE equipment 
      ALTER COLUMN daily_rate DROP NOT NULL
    `);
    console.log('✓ daily_rate column updated');
    
    console.log('\n✓ Database migration completed successfully!');
    
    await pool.end();
    console.log('✓ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration error:', error.message);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
    if (error.detail) {
      console.error(`Details: ${error.detail}`);
    }
    await pool.end();
    process.exit(1);
  }
}

migrateDatabase();
