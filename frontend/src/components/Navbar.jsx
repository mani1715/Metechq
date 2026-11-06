import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { agencyInfo } from '../data/mock';
import { Button } from './ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/blogs', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
    { path: '/chat', label: 'Chat' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo with Transparent Image */}
        <Link to="/" className="navbar-logo" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none'
        }}>
          <img 
            src="/favicon.svg" 
            alt="METECHQ Logo" 
            style={{
              height: '38px', width: '38px', borderRadius: '10px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(139, 92, 246, 0.3))'
            }}
          />
          <span className="logo-text" style={{
            fontSize: '20px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.5px'
          }}>
            {agencyInfo.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="navbar-cta">
          <Link to="/contact">
            <Button className="nav-cta-button">Start Project</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
            <Button className="mobile-cta-button">Start Project</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;