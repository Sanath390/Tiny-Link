import { useState, useEffect } from "react";

export default function Dashboard() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingCode, setDeletingCode] = useState(null);

    const loadLinks = async () => {
        try {
            const response = await fetch('/api/links');
            const data = await response.json();
            setRows(data);
        } catch (error) {
            console.error('Error loading links:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteRow = async (shortCode) => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        
        setDeletingCode(shortCode);
        
        try {
            const response = await fetch(`/api/links/${shortCode}`, { method: 'DELETE' });
            if (response.ok) {
                setTimeout(() => {
                    loadLinks();
                    setDeletingCode(null);
                }, 300);
            }
        } catch (error) {
            console.error('Error deleting link:', error);
            setDeletingCode(null);
        }
    };

    useEffect(() => {
        loadLinks();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="p-5 flex items-center justify-center">
                <div className="text-5xl font-bold">Dashboard</div>
            </div>
            <div className="mb-4 flex justify-center">
                <a href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Create New Link
                </a>
            </div>
            <div>
                <table className="w-4/5 mx-auto border-collapse border border-gray-300 shadow-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Short Code</th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Target URL</th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Total Clicks</th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Created</th>
                            <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr 
                                key={row.id} 
                                className={`hover:bg-gray-50 transition-all duration-300 ${
                                    deletingCode === row.short_code 
                                        ? 'opacity-50 bg-red-50' 
                                        : 'opacity-100'
                                }`}
                            >
                                <td className="border border-gray-300 px-4 py-2">
                                    <a href={`/code/${row.short_code}`} className="text-blue-500 hover:underline font-mono">
                                        {row.short_code}
                                    </a>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <a href={row.target_url} target="_blank" className="text-blue-500 hover:underline">
                                        {row.target_url.length > 50 ? row.target_url.substring(0, 50) + '...' : row.target_url}
                                    </a>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{row.clicks}</td>
                                <td className="border border-gray-300 px-4 py-2">{new Date(row.created_at).toLocaleDateString()}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button 
                                        onClick={() => deleteRow(row.short_code)}
                                        disabled={deletingCode === row.short_code}
                                        className={`px-2 py-1 rounded text-sm transition-colors ${
                                            deletingCode === row.short_code
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-red-500 hover:bg-red-600'
                                        } text-white`}
                                    >
                                        {deletingCode === row.short_code ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}