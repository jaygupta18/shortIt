import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link2, Copy, Check, ExternalLink, BarChart3 } from 'lucide-react';
import Navbar from '../components/navbar'
import { useAuth } from '../context/authContext';

const Home = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { token } = useAuth();

  const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.post(
        `${API_URL}/api/shorten`,
        { originalUrl: url },
        { headers }
      );

      if (response.data.success) {
        setShortUrl(response.data.data.shortUrl);
        setShortCode(response.data.data.shortCode);
        toast.success('Short URL created successfully!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create short URL';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setUrl('');
    setShortUrl('');
    setShortCode('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen  from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Shorten Your URLs
          </h1>
          <p className="text-xl text-gray-600">
            Create short, memorable links in seconds
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your long URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link2 className="h-5 w-5" />
              <span>{loading ? 'Shortening...' : 'Shorten URL'}</span>
            </button>
          </form>

          {shortUrl && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your shortened URL:
              </h3>
              
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-primary-600 font-medium"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition flex items-center space-x-2"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Test Link</span>
                </a>
                
                <button
                  onClick={handleReset}
                  className="text-gray-600 hover:text-gray-700 font-medium"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Link2 className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quick & Easy
            </h3>
            <p className="text-gray-600">
              Shorten URLs in just one click
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Track Clicks
            </h3>
            <p className="text-gray-600">
              Monitor how many times your links are clicked
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Reliable
            </h3>
            <p className="text-gray-600">
              Your links are secure and always available
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;