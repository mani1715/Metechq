import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, Menu, X, PhoneCall } from 'lucide-react';
import { corporateInfo } from '../../data/corporateData';
import './corporate.css';

const CorporateNav = ({ onContactClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      
      <nav className="corporate-nav">
        <div className="container">
          <div className="corporate-nav-content">
            <Link to="/demo/corporate" className="corporate-logo">
              <div className="corp-logo-badge">
                <Building2 size={24} className="text-blue-400" />
              </div>
              <div className="corp-logo-text">
                <span className="corp-brand-main">TechVentures</span>
                <span className="corp-brand-sub">GLOBAL ENTERPRISE</span>
              </div>
            </Link>

            <div className="corporate-nav-links">
              <a href="#solutions">Solutions</a>
              <a href="#roi-calculator">ROI Model</a>
              <a href="#case-studies">Case Studies</a>
              <a href="#team">Leadership</a>
              <a href="#insights">Insights</a>
              <button 
                className="corporate-nav-btn"
                onClick={onContactClick || (() => {
                  const el = document.getElementById('consultation');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                })}
              >
                <PhoneCall size={14} className="mr-1.5" />
                Schedule Briefing
              </button>
            </div>

            <button 
              className="corp-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="corp-mobile-drawer">
              <a href="#solutions" onClick={() => setMobileMenuOpen(false)}>Solutions</a>
              <a href="#roi-calculator" onClick={() => setMobileMenuOpen(false)}>ROI Model</a>
              <a href="#case-studies" onClick={() => setMobileMenuOpen(false)}>Case Studies</a>
              <a href="#team" onClick={() => setMobileMenuOpen(false)}>Leadership</a>
              <a href="#consultation" onClick={() => setMobileMenuOpen(false)}>Schedule Consultation</a>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default CorporateNav;
