import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import axios from 'axios';
import { getBackendURL } from '../../lib/utils';
import '../admin.css';

const BACKEND_URL = getBackendURL();

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,   // ✅ FIXED URL
        {
          username,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // ✅ Store JWT token
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.admin));

      // ✅ Redirect to admin dashboard
      window.location.href = '/admin';

    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);

      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Invalid username or password'
      );

      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #352a21 0%, #2D3E50 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/favicon.svg"
            alt="METECHQ Logo"
            style={{ height: '64px', width: '64px', margin: '0 auto 16px auto', display: 'block', borderRadius: '16px', boxShadow: '0 8px 24px rgba(163, 78, 29, 0.35)' }}
          />
          <h1 style={{ fontSize: '28px', fontWeight: '700' }}>
            METECHQ Admin
          </h1>
          <p style={{ color: '#6B7280' }}>
            Sign in to manage your website
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">
              <User size={16} /> Username
            </label>
            <input
              type="text"
              className="admin-form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              <Lock size={16} /> Password
            </label>
            <input
              type="password"
              className="admin-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="/" style={{ color: '#a34e1d' }}>
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
