import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, ChevronDown, Sparkles, ExternalLink, 
  ShoppingBag, Building2, BarChart3, Smartphone, 
  Utensils, Rocket, Home, GraduationCap, Check
} from 'lucide-react';
import './DemoTopNav.css';

const DEMO_LIST = [
  {
    name: 'StyleHub E-Commerce',
    path: '/demo/ecommerce',
    category: 'E-Commerce',
    icon: ShoppingBag,
    color: '#8b5cf6'
  },
  {
    name: 'TechVentures Corporate',
    path: '/demo/corporate',
    category: 'Corporate',
    icon: Building2,
    color: '#3b82f6'
  },
  {
    name: 'Analytics Dashboard Pro',
    path: '/demo/analytics',
    category: 'SaaS / Analytics',
    icon: BarChart3,
    color: '#10b981'
  },
  {
    name: 'FitLife Mobile Design System',
    path: '/demo/fitness-app',
    category: 'Mobile UI/UX',
    icon: Smartphone,
    color: '#ec4899'
  },
  {
    name: 'Restaurant Booking Platform',
    path: '/demo/restaurant',
    category: 'Hospitality',
    icon: Utensils,
    color: '#f97316'
  },
  {
    name: 'TaskFlow Pro - SaaS Landing',
    path: '/demo/saas-landing',
    category: 'Product Landing',
    icon: Rocket,
    color: '#06b6d4'
  },
  {
    name: 'Real Estate Listing Portal',
    path: '/demo/real-estate',
    category: 'PropTech / Listings',
    icon: Home,
    color: '#eab308'
  },
  {
    name: 'EduLearn - LMS Platform',
    path: '/demo/lms',
    category: 'EdTech / LMS',
    icon: GraduationCap,
    color: '#6366f1'
  }
];

export default function DemoTopNav({ currentDemoTitle, portfolioSlug }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPath = location.pathname;
  const activeDemo = DEMO_LIST.find(d => currentPath.startsWith(d.path)) || {
    name: currentDemoTitle || 'Interactive Showcase Demo',
    category: 'Metechq Demo'
  };

  const backLink = portfolioSlug ? `/portfolio/${portfolioSlug}` : '/portfolio';

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
            <span className="live-text">Live Demo</span>
          </div>

          <span className="demo-name-badge">{activeDemo.name}</span>
        </div>

        {/* Center/Right: Demo Switcher Dropdown */}
        <div className="demo-topbar-right">
          <div className="demo-switcher-wrapper" ref={dropdownRef}>
            <button 
              className="demo-switcher-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              title="Explore other interactive demos"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Switch Demo ({DEMO_LIST.length})</span>
              <ChevronDown className={`h-3.5 w-3.5 chevron-icon ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="demo-switcher-menu">
                <div className="demo-switcher-header">
                  <span>Interactive Project Demos</span>
                  <span className="demo-count-tag">8 Live Builds</span>
                </div>
                <div className="demo-switcher-list">
                  {DEMO_LIST.map((demo) => {
                    const IconComponent = demo.icon;
                    const isActive = currentPath.startsWith(demo.path);
                    return (
                      <Link
                        key={demo.path}
                        to={demo.path}
                        onClick={() => setDropdownOpen(false)}
                        className={`demo-switcher-item ${isActive ? 'active' : ''}`}
                      >
                        <div className="demo-item-icon" style={{ backgroundColor: `${demo.color}18`, color: demo.color }}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="demo-item-info">
                          <span className="demo-item-name">{demo.name}</span>
                          <span className="demo-item-category">{demo.category}</span>
                        </div>
                        {isActive && <Check className="h-4 w-4 text-emerald-500 ml-auto" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link to="/contact" className="demo-hire-btn">
            <span>Hire Us</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
