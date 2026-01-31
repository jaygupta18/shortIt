import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import Navbar from '../components/navbar';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(name, email, password);
    
    if (result.success) {
      navigate('/');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-dark-surface rounded-2xl border border-dark-border p-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-text mb-2">
              Create Account
            </h1>
            <p className="text-dark-text-muted">
              Start shortening your URLs today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-text-muted mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-text-subtle" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-3.5 bg-dark-bg-elevated border border-dark-border rounded-xl text-dark-text placeholder-dark-text-subtle transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text-muted mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-text-subtle" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3.5 bg-dark-bg-elevated border border-dark-border rounded-xl text-dark-text placeholder-dark-text-subtle transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-text-muted mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-text-subtle" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3.5 bg-dark-bg-elevated border border-dark-border rounded-xl text-dark-text placeholder-dark-text-subtle transition"
                />
              </div>
              <p className="mt-1 text-sm text-dark-text-subtle">
                Must be at least 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-accent-hover text-dark-bg font-semibold py-3.5 px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-glow/30"
            >
              <UserPlus className="h-5 w-5" />
              <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-hover font-medium transition">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;