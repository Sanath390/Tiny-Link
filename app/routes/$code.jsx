import { Pool } from 'pg';
import { redirect } from 'react-router';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function loader({ params }) {
  try {
    const { code } = params;
    
    const result = await pool.query(
      'UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE short_code = $1 RETURNING target_url',
      [code]
    );
    
    if (result.rows.length === 0) {
      throw new Response('Short link not found', { status: 404 });
    }
    
    return redirect(result.rows[0].target_url);
  } catch (error) {
    throw new Response('Server error', { status: 500 });
  }
}