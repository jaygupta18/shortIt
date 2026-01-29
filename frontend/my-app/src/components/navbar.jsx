import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { Link2, LogOut, User, Home, History } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Link2 className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">
              ShortIt
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/my-urls"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  <History className="h-4 w-4" />
                  <span>My URLs</span>
                </Link>
                <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition"
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