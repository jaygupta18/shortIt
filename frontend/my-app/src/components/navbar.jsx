import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Link2, LogOut, User, Home, History } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-dark-surface/80 backdrop-blur-xl border-b border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-1.5 rounded-lg bg-accent-muted group-hover:bg-accent/20 transition-colors">
              <Link2 className="h-6 w-6 text-accent" />
            </div>
            <span className="text-xl font-bold text-dark-text tracking-tight">
              ShortIt
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-dark-text-muted hover:text-dark-text hover:bg-dark-surface-hover transition"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/my-urls"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-dark-text-muted hover:text-dark-text hover:bg-dark-surface-hover transition"
                >
                  <History className="h-4 w-4" />
                  <span>My URLs</span>
                </Link>
                <div className="flex items-center space-x-2 px-3 py-2 text-sm text-dark-text-muted border-l border-dark-border ml-2 pl-4">
                  <User className="h-4 w-4 text-accent" />
                  <span className="text-dark-text">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-danger hover:bg-danger-hover transition ml-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-dark-text-muted hover:text-dark-text hover:bg-dark-surface-hover transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-dark-bg bg-accent hover:bg-accent-hover text-black font-semibold transition ml-2 shadow-lg shadow-accent-glow/30"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;