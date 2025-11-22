import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function loader({ params }) {
  try {
    const { code } = params;
    const result = await pool.query('SELECT * FROM links WHERE short_code = $1', [code]);
    
    if (result.rows.length === 0) {
      throw new Response('Link not found', { status: 404 });
    }
    
    return Response.json(result.rows[0]);
  } catch (error) {
    throw new Response('Server error', { status: 500 });
  }
}

export default function CodeStats() {
  const params = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`/api/links/${params.code}`);
        if (response.ok) {
          const data = await response.json();
          setLink(data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [params.code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Link Not Found</h1>
          <a href="/" className="text-blue-500 hover:underline">← Back to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <a href="/" className="text-blue-500 hover:underline">← Back to Dashboard</a>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Link Statistics</h1>
        
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Link Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Short Code</label>
                  <div className="text-lg font-mono">{link.short_code}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Target URL</label>
                  <a href={link.target_url} target="_blank" className="text-blue-500 hover:underline break-all">
                    {link.target_url}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Short URL</label>
                  <div className="font-mono text-green-600">
                    {window.location.origin}/{link.short_code}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Statistics</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Total Clicks</label>
                  <div className="text-2xl font-bold text-blue-600">{link.clicks}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Created</label>
                  <div>{new Date(link.created_at).toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Last Clicked</label>
                  <div>
                    {link.last_clicked 
                      ? new Date(link.last_clicked).toLocaleString()
                      : 'Never'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}