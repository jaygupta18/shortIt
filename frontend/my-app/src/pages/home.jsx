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

  const API_URL = import.meta.env.REACT_APP_API_URL || 'https://shortit-vanx.onrender.com';

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
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="text-5xl sm:text-6xl font-bold text-dark-text mb-4 tracking-tight">
            Shorten Your URLs
          </h1>
          <p className="text-xl text-dark-text-muted max-w-xl mx-auto">
            Create short, memorable links in seconds
          </p>
        </div>

        <div className="bg-dark-surface rounded-2xl border border-dark-border p-8 mb-10 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-dark-text-muted mb-2">
                Enter your long URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  className="w-full px-4 py-3.5 bg-dark-bg-elevated border border-dark-border rounded-xl text-dark-text placeholder-dark-text-subtle transition"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-accent-hover text-dark-bg font-semibold py-3.5 px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-glow/30"
            >
              <Link2 className="h-5 w-5" />
              <span>{loading ? 'Shortening...' : 'Shorten URL'}</span>
            </button>
          </form>

          {shortUrl && (
            <div className="mt-8 p-6 bg-success-muted border border-dark-border rounded-xl">
              <h3 className="text-lg font-semibold text-dark-text mb-4">
                Your shortened URL
              </h3>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-dark-bg-elevated border border-dark-border rounded-xl text-accent font-medium"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-accent hover:bg-accent-hover text-dark-bg font-medium rounded-xl transition flex items-center justify-center space-x-2 shrink-0"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-accent hover:text-accent-hover font-medium transition"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Test Link</span>
                </a>
                
                <button
                  onClick={handleReset}
                  className="text-dark-text-muted hover:text-dark-text font-medium transition"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-dark-surface rounded-xl border border-dark-border p-6 text-center hover:border-dark-border hover:bg-dark-surface-hover transition">
            <div className="bg-accent-muted rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <Link2 className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-dark-text mb-2">
              Quick & Easy
            </h3>
            <p className="text-dark-text-muted text-sm">
              Shorten URLs in just one click
            </p>
          </div>

          <div className="bg-dark-surface rounded-xl border border-dark-border p-6 text-center hover:border-dark-border hover:bg-dark-surface-hover transition">
            <div className="bg-purple-muted rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-7 w-7 text-purple" />
            </div>
            <h3 className="text-lg font-semibold text-dark-text mb-2">
              Track Clicks
            </h3>
            <p className="text-dark-text-muted text-sm">
              Monitor how many times your links are clicked
            </p>
          </div>

          <div className="bg-dark-surface rounded-xl border border-dark-border p-6 text-center hover:border-dark-border hover:bg-dark-surface-hover transition">
            <div className="bg-success-muted rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-4">
              <Check className="h-7 w-7 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-dark-text mb-2">
              Reliable
            </h3>
            <p className="text-dark-text-muted text-sm">
              Your links are secure and always available
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;