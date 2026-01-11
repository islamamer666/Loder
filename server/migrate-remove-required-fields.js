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
    console.log('Starting database migration to remove required fields...');
    console.log('Database:', DATABASE_URL.split('@')[1].split('/')[1]);
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful\n');
    
    // Make title nullable
    console.log('Making title nullable...');
    await pool.query(`
      ALTER TABLE equipment 
      ALTER COLUMN title DROP NOT NULL
    `);
    console.log('✓ title column updated');
    
    // Make daily_rate nullable (already done in previous migration, but safe to run)
    console.log('Making daily_rate nullable...');
    await pool.query(`
      ALTER TABLE equipment 
      ALTER COLUMN daily_rate DROP NOT NULL
    `);
    console.log('✓ daily_rate column updated');
    
    // Make location nullable
    console.log('Making location nullable...');
    await pool.query(`
      ALTER TABLE equipment 
      ALTER COLUMN location DROP NOT NULL
    `);
    console.log('✓ location column updated');
    
    // Make owner_name nullable
    console.log('Making owner_name nullable...');
    await pool.query(`
      ALTER TABLE equipment 
      ALTER COLUMN owner_name DROP NOT NULL
    `);
    console.log('✓ owner_name column updated');
    
    // Make owner_email nullable
    console.log('Making owner_email nullable...');
    await pool.query(`
      ALTER TABLE equipment 
      ALTER COLUMN owner_email DROP NOT NULL
    `);
    console.log('✓ owner_email column updated');
    
    console.log('\n✓ Database migration completed successfully!');
    console.log('All fields are now optional.');
    
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
    // If column is already nullable, that's fine - continue
    if (error.message.includes('does not exist') || error.message.includes('does not have')) {
      console.log('Note: Some columns may already be nullable. This is fine.');
    }
    await pool.end();
    process.exit(1);
  }
}

migrateDatabase();
