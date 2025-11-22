import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function action({ request, params }) {
  if (request.method === 'POST') {
    const formData = await request.formData();
    const longUrl = formData.get('longUrl');
    const customCode = formData.get('customCode');
    
    try {  
      let shortCode;
      if (customCode) {
        if (!/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
          return Response.json({ error: 'Custom code must be 6-8 alphanumeric characters' }, { status: 400 });
        }
        shortCode = customCode;
      } else {
        
        shortCode = Math.random().toString(36).substring(2, 8);
      }
      
      const existing = await pool.query('SELECT id FROM links WHERE short_code = $1', [shortCode]);
      if (existing.rows.length > 0) {
        return Response.json({ error: `Short code "${shortCode}" already exists` }, { status: 409 });
      }
      
      const result = await pool.query(
        'INSERT INTO links (short_code, target_url) VALUES ($1, $2) RETURNING *',
        [shortCode, longUrl]
      );
      
      return Response.json({ 
        shortCode, 
        shortUrl: `${process.env.BASE_URL || 'http://localhost:5173'}/${shortCode}`,
        targetUrl: longUrl 
      });
    } catch (error) {
      return Response.json({ error: 'Server error' }, { status: 500 });
    }
  }
  
  
  if (request.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
      return Response.json(result.rows);
    } catch (error) {
      return Response.json({ error: 'Server error' }, { status: 500 });
    }
  }
}

export async function loader() {
  try {
    const result = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
    return Response.json(result.rows);
  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}