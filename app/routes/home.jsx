import { useState } from "react";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!validateUrl(longUrl)) {
      setError("Please enter a valid URL (include http:// or https://)");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('longUrl', longUrl);
      if (customCode) formData.append('customCode', customCode);

      const response = await fetch('/api/links', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(data.shortUrl);
        setSuccess("Short link created successfully!");
        setLongUrl("");
        setCustomCode("");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">URL Shortener</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Long URL *</label>
            <input
              type="text"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Custom Short Code (optional)</label>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toLowerCase())}
              placeholder="code"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded font-medium ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isLoading ? 'Creating...' : 'Create Short Link'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
            <div className="mb-2">{success}</div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={shortUrl} 
                readOnly 
                className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-sm"
              />
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shortUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <a href="/dashboard" className="text-blue-500 hover:underline">
            View Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
