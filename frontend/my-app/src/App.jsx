import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authContext';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import MyUrls from './pages/MyUrl';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-urls" element={<MyUrls />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#16161a',
              color: '#f4f4f5',
              border: '1px solid #27272d',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#34d399',
                secondary: '#0a0a0d',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#0a0a0d',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;