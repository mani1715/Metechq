import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
const links = [['/', 'Home'], ['/about', 'Studio'], ['/services', 'Services'], ['/portfolio', 'Our work'], ['/client/login', 'Client portal']];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggle = useRef(null);
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    const close = (event) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  return <header className="studio-nav">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="studio-nav-inner">
      <Link to="/" className="studio-brand" aria-label="METECHQ home"><span className="brand-symbol">m<span>.</span></span><span>METECHQ<small>DESIGN & DEVELOPMENT</small></span></Link>
      <nav className="studio-desktop-links" aria-label="Main navigation">{links.map(([path, label]) => <NavLink key={path} to={path} end={path === '/'}>{label}</NavLink>)}</nav>
      <Link to="/contact" className="studio-nav-cta">Let’s talk <ArrowUpRight size={17}/></Link>
      <button ref={toggle} className="studio-menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="studio-mobile-nav">{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <nav id="studio-mobile-nav" className="studio-mobile-links" aria-label="Mobile navigation">{[...links, ['/contact', 'Start a project'], ['/chat', 'Chat with us']].map(([path,label]) => <NavLink key={path} to={path} end={path === '/'}>{label}<ArrowUpRight size={18}/></NavLink>)}</nav>}
  </header>;
}
