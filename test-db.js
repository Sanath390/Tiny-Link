import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected successfully!');
    console.log('Current time:', result.rows[0].now);
    
    // Test if table exists
    const tableCheck = await pool.query("SELECT to_regclass('links')");
    if (tableCheck.rows[0].to_regclass) {
      console.log('Links table exists');
    } else {
      console.log('Links table not found - run schema.sql');
    }
  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();