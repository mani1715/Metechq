import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, ChevronDown, Sparkles, ExternalLink, 
  ShoppingBag, Building2, BarChart3, Smartphone, 
  Utensils, Rocket, Home, GraduationCap, Check
} from 'lucide-react';
import './DemoTopNav.css';

const DEMO_LIST = [
  { name: 'StayFinder Hospitality', path: '/demo/hospitality', category: 'Travel & Booking', icon: Building2, color: '#0ea5e9', portfolioSlug: 'hotel-management-system' },
  { name: 'Social Media Studio', path: '/demo/social-media', category: 'Social & Marketing', icon: BarChart3, color: '#a855f7', portfolioSlug: 'social-media-management' },
  {
    name: 'StyleHub E-Commerce',
    path: '/demo/ecommerce',
    category: 'E-Commerce',
    icon: ShoppingBag,
    color: '#8b5cf6',
    portfolioSlug: 'shopify-ecommerce-platform'
  },
  {
    name: 'TechVentures Corporate',
    path: '/demo/corporate',
    category: 'Corporate',
    icon: Building2,
    color: '#3b82f6',
    portfolioSlug: 'corporate-website-redesign'
  },
  {
    name: 'Analytics Dashboard Pro',
    path: '/demo/analytics',
    category: 'SaaS / Analytics',
    icon: BarChart3,
    color: '#10b981',
    portfolioSlug: 'analytics-dashboard'
  },
  {
    name: 'FitLife Mobile Design System',
    path: '/demo/fitness-app',
    category: 'Mobile UI/UX',
    icon: Smartphone,
    color: '#ec4899',
    portfolioSlug: 'mobile-app-design-system'
  },
  {
    name: 'Restaurant Booking Platform',
    path: '/demo/restaurant',
    category: 'Hospitality',
    icon: Utensils,
    color: '#f97316',
    portfolioSlug: 'restaurant-booking-platform'
  },
  {
    name: 'TaskFlow Pro - SaaS Landing',
    path: '/demo/saas-landing',
    category: 'Product Landing',
    icon: Rocket,
    color: '#06b6d4',
    portfolioSlug: 'saas-landing-page'
  },
  {
    name: 'Real Estate Listing Portal',
    path: '/demo/real-estate',
    category: 'PropTech / Listings',
    icon: Home,
    color: '#eab308',
    portfolioSlug: 'real-estate-portal'
  },
  {
    name: 'EduLearn - LMS Platform',
    path: '/demo/lms',
    category: 'EdTech / LMS',
    icon: GraduationCap,
    color: '#6366f1',
    portfolioSlug: 'educational-lms-platform'
  }
];

export default function DemoTopNav({ currentDemoTitle, portfolioSlug }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    const handleKey = event => { if (event.key === 'Escape') setDropdownOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => { 
      document.removeEventListener('mousedown', handleClickOutside); 
      document.removeEventListener('keydown', handleKey); 
    };
  }, []);

  const currentPath = location.pathname.replace('/demo/mobile-design', '/demo/fitness-app').replace('/demo/restaurant-booking', '/demo/restaurant');
  const activeDemo = DEMO_LIST.find(d => currentPath.startsWith(d.path)) || {
    name: currentDemoTitle || 'Interactive Showcase Demo',
    category: 'Metechq Demo',
    portfolioSlug: portfolioSlug || ''
  };

  const targetSlug = portfolioSlug || activeDemo.portfolioSlug;
  const backLink = targetSlug ? `/portfolio/${targetSlug}` : '/portfolio';

  return (
    <header className="metechq-demo-topbar">
      <div className="metechq-demo-topbar-inner">
        {/* Left: Back Link & Metechq Branding */}
        <div className="demo-topbar-left">
          <Link to={backLink} className="demo-back-btn" title="Return to Metechq Portfolio">
            <ArrowLeft className="h-4 w-4" />
            <span className="demo-back-text">Portfolio</span>
          </Link>

          <div className="demo-divider"></div>

          {/* Live Indicator Badge */}
          <div className="demo-live-pill">
            <span className="live-dot-pulse"></span>
            <span className="live-text">Interactive concept</span>
          </div>

          <span className="demo-name-badge">{activeDemo.name}</span>
          <Link to="/about" className="demo-back-btn">Powered by METECHQ ↗</Link>
        </div>

        {/* Center/Right: Demo Switcher Dropdown */}
        <div className="demo-topbar-right">
          <div className="demo-switcher-wrapper" ref={dropdownRef}>
            <button 
              className="demo-switcher-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="Switch Interactive Demo"
              id="demo-switcher-button"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="active-demo-label">Switch Demo</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="demo-switcher-menu" role="menu" aria-labelledby="demo-switcher-button">
                <div className="demo-switcher-header">
                  <span>Interactive Project Demos</span>
                  <span className="demo-count-tag">{DEMO_LIST.length} concepts</span>
                </div>
                <div className="demo-switcher-list">
                  {DEMO_LIST.map((demo) => {
                    const DemoIcon = demo.icon;
                    const isSelected = currentPath.startsWith(demo.path);
                    return (
                      <Link
                        key={demo.path}
                        to={demo.path}
                        className={`demo-switcher-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => setDropdownOpen(false)}
                        role="menuitem"
                      >
                        <div className="demo-item-icon" style={{ backgroundColor: `${demo.color}15`, color: demo.color }}>
                          <DemoIcon className="h-4 w-4" />
                        </div>
                        <div className="demo-item-info">
                          <span className="demo-item-name">{demo.name}</span>
                          <span className="demo-item-category">{demo.category}</span>
                        </div>
                        {isSelected && (
                          <div className="demo-item-active-dot">
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
                <div className="demo-switcher-footer">
                  <Link to="/portfolio" className="all-projects-link" onClick={() => setDropdownOpen(false)}>
                    <span>View All Portfolio Case Studies</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Direct CTA */}
          <Link to="/contact" className="demo-hire-btn">
            Let's Talk
          </Link>
        </div>
      </div>
    </header>
  );
}
