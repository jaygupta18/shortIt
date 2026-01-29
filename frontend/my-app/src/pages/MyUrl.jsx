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

  const API_URL = import.meta.env.REACT_APP_API_URL || 'https://shortit-vanx.onrender.com/';

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
    <div className="min-h-screen  from-blue-50 via-white to-purple-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My URLs
          </h1>
          <p className="text-lg text-gray-600">
            Manage and track your shortened links
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : urls.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Link2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No URLs yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first shortened URL to get started
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition"
            >
              Create URL
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {urls.map((url) => (
              <div
                key={url._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-semibold text-primary-600 hover:text-primary-700 flex items-center space-x-2"
                      >
                        <span>{url.shortUrl}</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    <p className="text-gray-600 break-all">
                      {url.originalUrl}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleCopy(url.shortUrl)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                      title="Copy URL"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(url._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete URL"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                    <span className="font-medium">
                      {url.clickCount} {url.clickCount === 1 ? 'click' : 'clicks'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Created {formatDate(url.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {urls.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Statistics Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-primary-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total URLs</p>
                <p className="text-3xl font-bold text-primary-600">{urls.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
                <p className="text-3xl font-bold text-green-600">
                  {urls.reduce((sum, url) => sum + url.clickCount, 0)}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Avg Clicks/URL</p>
                <p className="text-3xl font-bold text-purple-600">
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