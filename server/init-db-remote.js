const { Pool } = require('pg');

// External Database URL from Render
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://loder:fYm0xgADYMv6C0noY1RKp7mPJsRq1qXD@dpg-d5dtcddactks73cddipg-a.frankfurt-postgres.render.com/loderdb';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeDatabase() {
  try {
    console.log('Connecting to remote database...');
    console.log('Database:', DATABASE_URL.split('@')[1].split('/')[1]);
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful\n');
    
    // Create categories table
    console.log('Creating categories table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        name_ar VARCHAR(100) NOT NULL,
        icon VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Categories table created');
    
    // Create equipment table
    console.log('Creating equipment table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS equipment (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        daily_rate DECIMAL(10, 2) NOT NULL,
        location VARCHAR(200) NOT NULL,
        owner_name VARCHAR(100) NOT NULL,
        owner_email VARCHAR(100) NOT NULL,
        owner_phone VARCHAR(20),
        images JSONB DEFAULT '[]'::jsonb,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Equipment table created');
    
    // Insert categories
    console.log('Inserting categories...');
    const insertResult = await pool.query(`
      INSERT INTO categories (name, name_ar, icon) VALUES
        ('Excavators', 'حفارات', 'excavator'),
        ('Bulldozers', 'جرافات', 'bulldozer'),
        ('Cranes', 'رافعات', 'crane'),
        ('Loaders', 'لوادر', 'loader'),
        ('Dump Trucks', 'شاحنات قلابة', 'truck'),
        ('Compactors', 'مدكوكات', 'compactor'),
        ('Concrete Mixers', 'خلاطات خرسانة', 'mixer'),
        ('Generators', 'مولدات', 'generator'),
        ('Scaffolding', 'سقالات', 'scaffolding'),
        ('Forklifts', 'رافعات شوكية', 'forklift'),
        ('Pick & Carry', 'رافعات محمولة', 'pick-carry'),
        ('Boom Lifts', 'رافعات بوم', 'boom-lift'),
        ('Scissor Lifts', 'رافعات مقصية', 'scissor-lift'),
        ('Tractors', 'جرارات', 'tractor'),
        ('Backhoes', 'حفارات خلفية', 'backhoe'),
        ('Trucks', 'شاحنات', 'truck'),
        ('Asphalt Compaction Double Drum', 'مدكوكات أسفلت مزدوجة', 'asphalt-compactor'),
        ('Other', 'أخرى', 'other')
      ON CONFLICT (name) DO NOTHING
    `);
    console.log('✓ Categories inserted');
    
    // Create indexes
    console.log('Creating indexes...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category_id);
      CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location);
      CREATE INDEX IF NOT EXISTS idx_equipment_available ON equipment(is_available);
    `);
    console.log('✓ Indexes created');
    
    // Verify categories
    const result = await pool.query('SELECT COUNT(*) as count, array_agg(name) as names FROM categories');
    console.log(`\n✓ Database initialized successfully!`);
    console.log(`✓ Found ${result.rows[0].count} categories:`);
    result.rows[0].names.forEach((name, idx) => {
      console.log(`  ${idx + 1}. ${name}`);
    });
    
    await pool.end();
    console.log('\n✓ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Database initialization error:', error.message);
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

initializeDatabase();
