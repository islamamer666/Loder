const { Pool } = require('pg');
const dotenv = require('dotenv');
const readline = require('readline');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'loder',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function removeAllEquipment() {
  try {
    console.log('Connecting to database...\n');
    
    // Check how many equipment listings exist
    const countResult = await pool.query('SELECT COUNT(*) FROM equipment');
    const equipmentCount = parseInt(countResult.rows[0].count);
    
    if (equipmentCount === 0) {
      console.log('✓ No equipment listings found in the database.');
      await pool.end();
      rl.close();
      process.exit(0);
    }
    
    console.log(`⚠️  WARNING: Found ${equipmentCount} equipment listing(s) in the database.`);
    console.log('⚠️  This operation will DELETE ALL equipment listings permanently!\n');
    
    // First confirmation
    const answer1 = await askQuestion('Are you sure you want to delete ALL equipment listings? (yes/no): ');
    
    if (answer1.toLowerCase() !== 'yes') {
      console.log('\n✓ Operation cancelled. No changes were made.');
      await pool.end();
      rl.close();
      process.exit(0);
    }
    
    // Second confirmation for extra safety
    const answer2 = await askQuestion(`Type "DELETE ${equipmentCount}" to confirm: `);
    
    if (answer2 !== `DELETE ${equipmentCount}`) {
      console.log('\n✓ Operation cancelled. No changes were made.');
      await pool.end();
      rl.close();
      process.exit(0);
    }
    
    console.log('\nDeleting all equipment listings...');
    
    // Delete all equipment
    const deleteResult = await pool.query('DELETE FROM equipment RETURNING id');
    const deletedCount = deleteResult.rows.length;
    
    console.log(`\n✓ Successfully deleted ${deletedCount} equipment listing(s).`);
    console.log('✓ Database is now empty of equipment listings.\n');
    
    await pool.end();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('\nPlease check:');
    console.error('1. PostgreSQL is running');
    console.error('2. Database credentials in server/.env are correct');
    console.error('3. Database "loder" exists');
    console.error('4. Equipment table exists\n');
    await pool.end();
    rl.close();
    process.exit(1);
  }
}

removeAllEquipment();
