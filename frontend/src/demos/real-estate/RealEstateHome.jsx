import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Home, Building2, MapPin, Bed, Bath, 
  Maximize, DollarSign, Heart, ChevronRight, Star, 
  Sparkles, ShieldCheck, Calendar, Phone, ArrowRight,
  Map, Grid, Calculator, Eye, Check
} from 'lucide-react';
import { properties } from '../../data/realEstateData';
import './real-estate.css';

export default function RealEstateHome() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('grid'); // 'grid' | 'map'
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [priceTier, setPriceTier] = useState('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState('any');
  const [savedFavorites, setSavedFavorites] = useState({});
  const [activeMapProperty, setActiveMapProperty] = useState(properties[0] || null);

  // Mortgage Calculator State
  const [calcPrice, setCalcPrice] = useState(1250000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const interestRate = 6.25;

  // Tour Booking Modal State
  const [tourModalProperty, setTourModalProperty] = useState(null);
  const [tourConfirmed, setTourConfirmed] = useState(false);
  const [tourDate, setTourDate] = useState('2026-03-28');
  const [tourTime, setTourTime] = useState('11:00 AM');

  // Filter logic
  const filteredList = useMemo(() => {
    return properties.filter(p => {
      const matchLoc = !searchLocation || 
        p.title.toLowerCase().includes(searchLocation.toLowerCase()) ||
        p.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
        p.address.toLowerCase().includes(searchLocation.toLowerCase());
      
      const matchType = selectedType === 'All' || p.type.toLowerCase() === selectedType.toLowerCase();

      let matchPrice = true;
      if (priceTier === 'under1m') matchPrice = p.price < 1000000;
      else if (priceTier === '1m-2m') matchPrice = p.price >= 1000000 && p.price < 2000000;
      else if (priceTier === '2m+') matchPrice = p.price >= 2000000;

      let matchBeds = true;
      if (selectedBedrooms === '1') matchBeds = p.bedrooms === 1;
      else if (selectedBedrooms === '2') matchBeds = p.bedrooms === 2;
      else if (selectedBedrooms === '3') matchBeds = p.bedrooms === 3;
      else if (selectedBedrooms === '4+') matchBeds = p.bedrooms >= 4;

      return matchLoc && matchType && matchPrice && matchBeds;
    });
  }, [searchLocation, selectedType, priceTier, selectedBedrooms]);

  // Mortgage calculation formula
  const monthlyMortgage = useMemo(() => {
    const principal = calcPrice * (1 - downPaymentPct / 100);
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = loanTermYears * 12;
    const monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                    (Math.pow(1 + monthlyRate, numPayments) - 1);
    return Math.round(monthly);
  }, [calcPrice, downPaymentPct, loanTermYears]);

  const toggleFavorite = (id) => {
    setSavedFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBookTour = (e) => {
    e.preventDefault();
    setTourConfirmed(true);
  };

  return (
    <div className="real-estate-demo-page">

      {/* Hero Search Section */}
      <section className="real-estate-hero">
        <div className="re-hero-overlay"></div>
        <div className="re-container re-hero-inner">
          <div className="re-hero-badge">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Prime & Luxury Architectural Real Estate</span>
          </div>
          <h1 className="re-hero-title">
            Exceptional Properties, <br />
            <span className="text-gradient-amber">Unrivaled Living.</span>
          </h1>
          <p className="re-hero-subtitle">
            Curated architectural residences, luxury penthouses, and waterfront estates with immersive 3D virtual tours.
          </p>

          {/* Unified Floating Filter Bar */}
          <div className="re-search-panel">
            <div className="re-search-grid">
              {/* Location Input */}
              <div className="search-field">
                <label>Location / Neighborhood</label>
                <div className="input-with-icon">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <input 
                    type="text" 
                    placeholder="City, ZIP, or Area..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="search-field">
                <label>Property Category</label>
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="All">All Property Types</option>
                  <option value="House">Single Family Homes</option>
                  <option value="Condo">Luxury Condominiums</option>
                  <option value="Townhouse">Townhomes</option>
                  <option value="Villa">Luxury Villas</option>
                </select>
              </div>

              {/* Price Tier */}
              <div className="search-field">
                <label>Price Range</label>
                <select 
                  value={priceTier}
                  onChange={(e) => setPriceTier(e.target.value)}
                >
                  <option value="all">Any Price</option>
                  <option value="under1m">Under $1,000,000</option>
                  <option value="1m-2m">$1M - $2,000,000</option>
                  <option value="2m+">$2,000,000+</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div className="search-field">
                <label>Bedrooms</label>
                <select 
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                >
                  <option value="any">Any Bedrooms</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4+">4+ Bedrooms</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listings Section with View Toggle */}
      <section className="re-listings-section">
        <div className="re-container">
          <div className="re-section-bar">
            <div>
              <h2 className="re-section-title">
                {selectedType === 'All' ? 'Featured Properties' : `${selectedType} Listings`}
              </h2>
              <span className="re-results-count">
                Showing {filteredList.length} verified available properties
              </span>
            </div>

            {/* View Switcher: Grid vs Interactive Map */}
            <div className="view-toggle-pills">
              <button 
                className={`view-pill ${activeView === 'grid' ? 'active' : ''}`}
                onClick={() => setActiveView('grid')}
              >
                <Grid className="h-4 w-4 mr-1.5" />
                Grid View
              </button>
              <button 
                className={`view-pill ${activeView === 'map' ? 'active' : ''}`}
                onClick={() => setActiveView('map')}
              >
                <Map className="h-4 w-4 mr-1.5" />
                Interactive Map
              </button>
            </div>
          </div>

          {/* VIEW 1: GRID VIEW */}
          {activeView === 'grid' && (
            <div className="re-property-grid">
              {filteredList.map(prop => {
                const isFav = savedFavorites[prop.id];
                return (
                  <div key={prop.id} className="re-property-card">
                    <div className="prop-media-box">
                      <img src={prop.image} alt={prop.title} className="prop-img" />
                      <span className="prop-status-tag">{prop.status}</span>
                      <button 
                        className={`fav-button ${isFav ? 'active' : ''}`}
                        onClick={() => toggleFavorite(prop.id)}
                        title={isFav ? "Saved to Favorites" : "Save Property"}
                      >
                        <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
                      </button>
                      <div className="prop-price-floating">
                        ${prop.price.toLocaleString()}
                        {prop.status === 'For Rent' && <small>/mo</small>}
                      </div>
                    </div>

                    <div className="prop-body">
                      <div className="prop-type-badge">{prop.type} • {prop.city}</div>
                      <h3 className="prop-title">{prop.title}</h3>
                      <p className="prop-address">
                        <MapPin className="h-3.5 w-3.5 text-gray-500 inline mr-1" />
                        {prop.address}
                      </p>

                      <div className="prop-specs-row">
                        <div className="spec-item">
                          <Bed className="h-4 w-4 text-amber-500" />
                          <span>{prop.bedrooms} Beds</span>
                        </div>
                        <div className="spec-item">
                          <Bath className="h-4 w-4 text-amber-500" />
                          <span>{prop.bathrooms} Baths</span>
                        </div>
                        <div className="spec-item">
                          <Maximize className="h-4 w-4 text-amber-500" />
                          <span>{prop.sqft.toLocaleString()} sqft</span>
                        </div>
                      </div>

                      <div className="prop-card-actions">
                        <Link 
                          to={`/demo/real-estate/property/${prop.slug}`} 
                          className="view-details-action"
                        >
                          <span>Full Details</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <button 
                          className="book-tour-action"
                          onClick={() => {
                            setTourModalProperty(prop);
                            setTourConfirmed(false);
                          }}
                        >
                          Book Tour
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 2: INTERACTIVE MAP VIEW */}
          {activeView === 'map' && (
            <div className="re-interactive-map-frame">
              <div className="map-sidebar-list">
                <h4 className="map-sidebar-title">Select a Residence ({filteredList.length})</h4>
                <div className="map-prop-items">
                  {filteredList.map(p => (
                    <div 
                      key={p.id}
                      className={`map-sidebar-card ${activeMapProperty?.id === p.id ? 'active' : ''}`}
                      onClick={() => setActiveMapProperty(p)}
                    >
                      <img src={p.image} alt={p.title} className="map-thumb" />
                      <div className="map-thumb-info">
                        <strong>${p.price.toLocaleString()}</strong>
                        <p>{p.title}</p>
                        <span>{p.bedrooms} Beds • {p.bathrooms} Baths</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vector Map Canvas Simulator */}
              <div className="vector-map-canvas">
                <div className="map-water-accent"></div>
                <div className="map-grid-roads"></div>

                {/* Property Map Pins */}
                {filteredList.map((p, i) => {
                  const offsets = [
                    { top: '30%', left: '42%' },
                    { top: '55%', left: '60%' },
                    { top: '40%', left: '75%' },
                    { top: '65%', left: '35%' },
                    { top: '25%', left: '68%' },
                    { top: '70%', left: '78%' }
                  ];
                  const pos = offsets[i % offsets.length];
                  const isCur = activeMapProperty?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      className={`map-price-marker ${isCur ? 'selected' : ''}`}
                      style={{ top: pos.top, left: pos.left }}
                      onClick={() => setActiveMapProperty(p)}
                    >
                      ${(p.price / 1000).toFixed(0)}k
                    </button>
                  );
                })}

                {/* Active Property Flyout Card */}
                {activeMapProperty && (
                  <div className="map-preview-flyout">
                    <img src={activeMapProperty.image} alt={activeMapProperty.title} className="flyout-img" />
                    <div className="flyout-info">
                      <div className="flyout-price">${activeMapProperty.price.toLocaleString()}</div>
                      <h4 className="flyout-title">{activeMapProperty.title}</h4>
                      <p className="flyout-specs">
                        {activeMapProperty.bedrooms} Beds • {activeMapProperty.bathrooms} Baths • {activeMapProperty.sqft} sqft
                      </p>
                      <button 
                        className="flyout-btn"
                        onClick={() => {
                          setTourModalProperty(activeMapProperty);
                          setTourConfirmed(false);
                        }}
                      >
                        Schedule Showing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Mortgage Calculator */}
      <section className="re-calculator-section">
        <div className="re-container">
          <div className="mortgage-calc-card">
            <div className="calc-header-row">
              <div>
                <span className="calc-pretitle">FINANCIAL PLANNING</span>
                <h2 className="calc-title">Interactive Mortgage & Payment Estimator</h2>
              </div>
              <Calculator className="h-8 w-8 text-amber-400 opacity-70" />
            </div>

            <div className="calc-grid">
              <div className="calc-sliders-col">
                {/* Home Price */}
                <div className="calc-slider-group">
                  <div className="slider-label-row">
                    <span>Target Property Price</span>
                    <strong>${calcPrice.toLocaleString()}</strong>
                  </div>
                  <input 
                    type="range" 
                    min="300000" 
                    max="4500000" 
                    step="50000"
                    value={calcPrice}
                    onChange={(e) => setCalcPrice(Number(e.target.value))}
                    className="calc-range-bar"
                  />
                  <div className="range-extremes">
                    <span>$300k</span>
                    <span>$2.5M</span>
                    <span>$4.5M+</span>
                  </div>
                </div>

                {/* Down Payment */}
                <div className="calc-slider-group">
                  <div className="slider-label-row">
                    <span>Down Payment ({downPaymentPct}%)</span>
                    <strong>${((calcPrice * downPaymentPct) / 100).toLocaleString()}</strong>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="40" 
                    step="5"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="calc-range-bar"
                  />
                </div>

                {/* Loan Term */}
                <div className="calc-term-row">
                  <span>Loan Term:</span>
                  <div className="term-pills">
                    {[15, 30].map(yr => (
                      <button
                        key={yr}
                        className={`term-pill ${loanTermYears === yr ? 'active' : ''}`}
                        onClick={() => setLoanTermYears(yr)}
                      >
                        {yr}-Year Fixed ({interestRate}%)
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Payment Summary */}
              <div className="calc-output-box">
                <span className="output-tag">ESTIMATED MONTHLY PAYMENT</span>
                <div className="monthly-big-num">${monthlyMortgage.toLocaleString()}</div>
                <span className="monthly-breakdown-sub">Principal & Interest at {interestRate}% fixed</span>

                <div className="payment-breakdown-list">
                  <div className="breakdown-row">
                    <span>Principal & Interest</span>
                    <strong>${monthlyMortgage}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Estimated Property Taxes</span>
                    <strong>${Math.round(calcPrice * 0.012 / 12)}</strong>
                  </div>
                  <div className="breakdown-row">
                    <span>Homeowners Insurance</span>
                    <strong>$145</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Tour Booking Modal */}
      {tourModalProperty && (
        <div className="re-modal-backdrop">
          <div className="re-modal-window">
            <button className="re-modal-close" onClick={() => setTourModalProperty(null)}>×</button>

            {tourConfirmed ? (
              <div className="text-center py-4">
                <div className="tour-check-ring">
                  <Check className="h-8 w-8 text-emerald-400" />
                </div>
                <h3>Private Showing Requested</h3>
                <p>
                  A licensed listing advisor for <strong>{tourModalProperty.title}</strong> will confirm your private walkthrough on <strong>{tourDate} at {tourTime}</strong>.
                </p>
                <button 
                  className="re-modal-btn mt-4"
                  onClick={() => setTourModalProperty(null)}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookTour}>
                <span className="re-modal-pre">SCHEDULE A PRIVATE TOUR</span>
                <h3 className="re-modal-title">{tourModalProperty.title}</h3>
                <p className="re-modal-address">{tourModalProperty.address}</p>

                <div className="re-form-row">
                  <div className="re-form-group">
                    <label>Preferred Date</label>
                    <input 
                      type="date" 
                      required 
                      value={tourDate}
                      onChange={(e) => setTourDate(e.target.value)}
                      className="re-input"
                    />
                  </div>
                  <div className="re-form-group">
                    <label>Preferred Time</label>
                    <select 
                      value={tourTime}
                      onChange={(e) => setTourTime(e.target.value)}
                      className="re-input"
                    >
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>1:30 PM</option>
                      <option>3:00 PM</option>
                      <option>5:00 PM (Sunset Viewing)</option>
                    </select>
                  </div>
                </div>

                <div className="re-form-group">
                  <label>Full Name *</label>
                  <input type="text" required placeholder="Julian Vance" className="re-input" />
                </div>

                <div className="re-form-group">
                  <label>Email Address *</label>
                  <input type="email" required placeholder="julian@vancepartners.com" className="re-input" />
                </div>

                <button type="submit" className="re-modal-btn">
                  Confirm Showing Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
