import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function loader({ params }) {
  try {
    const { code } = params;
    const result = await pool.query('SELECT * FROM links WHERE short_code = $1', [code]);
    
    if (result.rows.length === 0) {
      return Response.json({ error: 'Link not found' }, { status: 404 });
    }
    
    return Response.json(result.rows[0]);
  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function action({ request, params }) {
  if (request.method === 'DELETE') {
    try {
      const { code } = params;
      
      await pool.query('DELETE FROM links WHERE short_code = $1', [code]);
      return Response.json({ success: true });
    } catch (error) {
      return Response.json({ error: 'Server error' }, { status: 500 });
    }
  }
}