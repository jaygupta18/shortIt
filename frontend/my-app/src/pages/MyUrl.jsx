import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/authContext';
import { Copy, Trash2, ExternalLink, BarChart3, Calendar, Link2 } from 'lucide-react';
import Navbar from '../components/navbar';

const MyUrls = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.REACT_APP_API_URL || 'https://shortit-vanx.onrender.com';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUrls();
  }, [isAuthenticated, navigate]);

  const fetchUrls = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/urls/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUrls(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;

    try {
      const response = await axios.delete(`${API_URL}/api/urls/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('URL deleted successfully');
        setUrls(urls.filter(url => url._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark-text mb-2">
            My URLs
          </h1>
          <p className="text-lg text-dark-text-muted">
            Manage and track your shortened links
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-dark-border border-t-accent"></div>
          </div>
        ) : urls.length === 0 ? (
          <div className="bg-dark-surface rounded-2xl border border-dark-border p-12 text-center">
            <div className="bg-dark-bg-elevated rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Link2 className="h-10 w-10 text-dark-text-subtle" />
            </div>
            <h2 className="text-2xl font-semibold text-dark-text mb-2">
              No URLs yet
            </h2>
            <p className="text-dark-text-muted mb-6">
              Create your first shortened URL to get started
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-dark-bg font-semibold rounded-xl transition shadow-lg shadow-accent-glow/30"
            >
              Create URL
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {urls.map((url) => (
              <div
                key={url._id}
                className="bg-dark-surface rounded-xl border border-dark-border hover:border-dark-border hover:bg-dark-surface-hover transition p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-accent hover:text-accent-hover flex items-center space-x-2 transition"
                      >
                        <span className="break-all">{url.shortUrl}</span>
                        <ExternalLink className="h-4 w-4 shrink-0" />
                      </a>
                    </div>
                    <p className="text-dark-text-muted break-all text-sm">
                      {url.originalUrl}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleCopy(url.shortUrl)}
                      className="p-2.5 text-dark-text-muted hover:text-accent hover:bg-accent-muted rounded-lg transition"
                      title="Copy URL"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(url._id)}
                      className="p-2.5 text-dark-text-muted hover:text-danger hover:bg-danger-muted rounded-lg transition"
                      title="Delete URL"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-dark-text-muted">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-success" />
                    <span className="font-medium">
                      {url.clickCount} {url.clickCount === 1 ? 'click' : 'clicks'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-info" />
                    <span>Created {formatDate(url.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {urls.length > 0 && (
          <div className="mt-8 bg-dark-surface rounded-xl border border-dark-border p-6">
            <h2 className="text-lg font-semibold text-dark-text mb-4">
              Statistics Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-accent-muted rounded-xl p-4 border border-dark-border-muted">
                <p className="text-sm text-dark-text-muted mb-1">Total URLs</p>
                <p className="text-3xl font-bold text-accent">{urls.length}</p>
              </div>
              <div className="bg-success-muted rounded-xl p-4 border border-dark-border-muted">
                <p className="text-sm text-dark-text-muted mb-1">Total Clicks</p>
                <p className="text-3xl font-bold text-success">
                  {urls.reduce((sum, url) => sum + url.clickCount, 0)}
                </p>
              </div>
              <div className="bg-purple-muted rounded-xl p-4 border border-dark-border-muted col-span-2 md:col-span-1">
                <p className="text-sm text-dark-text-muted mb-1">Avg Clicks/URL</p>
                <p className="text-3xl font-bold text-purple">
                  {urls.length > 0
                    ? Math.round(urls.reduce((sum, url) => sum + url.clickCount, 0) / urls.length)
                    : 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyUrls;