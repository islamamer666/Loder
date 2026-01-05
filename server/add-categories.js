const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'loder',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const newCategories = [
  { name: 'Forklifts', name_ar: 'رافعات شوكية', icon: 'forklift' },
  { name: 'Pick & Carry', name_ar: 'رافعات محمولة', icon: 'pick-carry' },
  { name: 'Boom Lifts', name_ar: 'رافعات بوم', icon: 'boom-lift' },
  { name: 'Scissor Lifts', name_ar: 'رافعات مقصية', icon: 'scissor-lift' },
  { name: 'Tractors', name_ar: 'جرارات', icon: 'tractor' },
  { name: 'Backhoes', name_ar: 'حفارات خلفية', icon: 'backhoe' },
  { name: 'Trucks', name_ar: 'شاحنات', icon: 'truck' },
  { name: 'Asphalt Compaction Double Drum', name_ar: 'مدكوكات أسفلت مزدوجة', icon: 'asphalt-compactor' }
];

async function addCategories() {
  try {
    console.log('Connecting to database...');
    
    for (const category of newCategories) {
      try {
        const result = await pool.query(
          'INSERT INTO categories (name, name_ar, icon) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING RETURNING *',
          [category.name, category.name_ar, category.icon]
        );
        
        if (result.rows.length > 0) {
          console.log(`✓ Added category: ${category.name}`);
        } else {
          console.log(`- Category already exists: ${category.name}`);
        }
      } catch (error) {
        console.error(`✗ Error adding ${category.name}:`, error.message);
      }
    }
    
    console.log('\nCategories update complete!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('\nPlease check:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database credentials in server/.env are correct');
    console.error('3. Database "loder" exists');
    process.exit(1);
  }
}

addCategories();

