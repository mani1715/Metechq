import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Utensils, Calendar, Clock, Users, MapPin, 
  Phone, Star, Check, Sparkles, Wine, Coffee, 
  Award, ArrowRight, ShieldCheck, Heart, ChefHat
} from 'lucide-react';
import DemoTopNav from '../common/DemoTopNav';
import './restaurant.css';

const RESTAURANTS = [
  {
    id: 1,
    name: 'Il Giardino Segreto',
    cuisine: 'Italian Fine Dining',
    michelin: '2 Michelin Stars',
    rating: 4.9,
    reviews: 628,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    price: '$$$$',
    location: 'Mayfair, Central District',
    chef: 'Chef Marco Bellini',
    description: 'Modern interpretations of regional Italian heritage, featuring handmade black truffle pasta and 400-vintage cellar.',
    features: ['Chef\'s Tasting Menu', 'Sommelier Pairing', 'Private Wine Cellar', 'Valet Parking'],
    slots: ['6:00 PM', '6:30 PM', '7:15 PM', '8:00 PM', '8:45 PM']
  },
  {
    id: 2,
    name: 'Sakura Omakase & Raw Bar',
    cuisine: 'Japanese Omakase',
    michelin: '1 Michelin Star',
    rating: 4.95,
    reviews: 482,
    image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800&h=600&fit=crop',
    price: '$$$$',
    location: 'Midtown Waterfront',
    chef: 'Master Jiro Takahashi',
    description: 'Intimate 12-seat cedar counter serving Tokyo Toyosu market wild-caught seafood flown in daily.',
    features: ['18-Course Omakase', 'Rare Sake Flight', 'Direct Chef Counter', 'Zero Compromise'],
    slots: ['5:30 PM', '7:30 PM', '9:30 PM']
  },
  {
    id: 3,
    name: 'Le Bistro Luminaire',
    cuisine: 'Modern French',
    michelin: 'Michelin Recommended',
    rating: 4.8,
    reviews: 840,
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&h=600&fit=crop',
    price: '$$$',
    location: 'Historic Arts Quarter',
    chef: 'Chef Éléonore Vance',
    description: 'Chic Parisian brasserie ambiance with duck confit, dry-aged côte de bœuf, and artisanal soufflés.',
    features: ['Heated Garden Terrace', 'Signature Cocktail Bar', 'Live Jazz Evenings', 'Weekend Brunch'],
    slots: ['6:00 PM', '6:45 PM', '7:30 PM', '8:15 PM', '9:00 PM']
  },
  {
    id: 4,
    name: 'Prime & Oak Ember House',
    cuisine: 'Wood-Fired Steakhouse',
    michelin: 'Best Steakhouse 2025',
    rating: 4.85,
    reviews: 910,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop',
    price: '$$$$',
    location: 'Financial Plaza',
    chef: 'Chef Daniel Sterling',
    description: 'A5 Miyazaki Wagyu and 60-day dry-aged Prime cuts seared over white oak and Japanese binchotan charcoal.',
    features: ['Dry-Age Glass Vault', 'Whiskey Library', 'Butcher\'s Reserve Cuts', 'Executive Dining'],
    slots: ['6:15 PM', '7:00 PM', '7:45 PM', '8:30 PM']
  }
];

export default function RestaurantBookingHome() {
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [activeModalRestaurant, setActiveModalRestaurant] = useState(null);
  
  // Reservation Form State
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('2026-03-24');
  const [selectedTime, setSelectedTime] = useState('7:15 PM');
  const [guestCount, setGuestCount] = useState(2);
  const [seatingArea, setSeatingArea] = useState('Main Dining Room');
  const [guestInfo, setGuestInfo] = useState({
    name: 'Sophia Montgomery',
    email: 'sophia.m@luxurytravel.com',
    phone: '+1 (555) 234-8901',
    dietary: 'No shellfish, celebrating anniversary'
  });
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);

  const filteredRestaurants = selectedCuisine === 'All' 
    ? RESTAURANTS 
    : RESTAURANTS.filter(r => r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase()));

  const handleOpenBooking = (rest) => {
    setActiveModalRestaurant(rest);
    setSelectedTime(rest.slots[0]);
    setBookingStep(1);
    setConfirmedBookingId(null);
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    const refCode = 'RES-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmedBookingId(refCode);
    setBookingStep(3);
  };

  return (
    <div className="restaurant-demo-page">
      <DemoTopNav currentDemoTitle="Restaurant Booking Platform" portfolioSlug="restaurant-booking-platform" />

      {/* Hero Banner */}
      <section className="restaurant-hero-banner">
        <div className="rest-container">
          <div className="rest-hero-badge">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Michelin & Fine Dining Reservation Engine</span>
          </div>
          <h1 className="rest-hero-title">
            Reserve Unforgettable <br />
            <span className="text-gradient-gold">Culinary Experiences.</span>
          </h1>
          <p className="rest-hero-subtitle">
            Instant real-time table confirmation at premier dining establishments, chef counters, and private wine cellars.
          </p>

          {/* Quick Filters */}
          <div className="rest-filter-bar">
            {['All', 'Italian', 'Japanese', 'French', 'Steakhouse'].map(cat => (
              <button
                key={cat}
                className={`rest-pill-btn ${selectedCuisine === cat ? 'active' : ''}`}
                onClick={() => setSelectedCuisine(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="rest-showcase-section">
        <div className="rest-container">
          <div className="rest-grid">
            {filteredRestaurants.map(rest => (
              <div key={rest.id} className="rest-card">
                <div className="rest-media-box">
                  <img src={rest.image} alt={rest.name} className="rest-card-img" />
                  <span className="michelin-tag">
                    <Award className="h-3.5 w-3.5 mr-1" />
                    {rest.michelin}
                  </span>
                  <span className="rest-price-pill">{rest.price}</span>
                </div>

                <div className="rest-card-content">
                  <div className="rest-card-header">
                    <div>
                      <span className="rest-cuisine">{rest.cuisine}</span>
                      <h3 className="rest-name">{rest.name}</h3>
                    </div>
                    <div className="rest-rating">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{rest.rating}</span>
                      <small>({rest.reviews})</small>
                    </div>
                  </div>

                  <p className="rest-desc">{rest.description}</p>

                  <div className="rest-chef-row">
                    <ChefHat className="h-4 w-4 text-amber-500" />
                    <span>Executive Chef: <strong>{rest.chef}</strong></span>
                  </div>

                  <div className="rest-features-pills">
                    {rest.features.slice(0, 3).map((f, i) => (
                      <span key={i} className="feature-pill">{f}</span>
                    ))}
                  </div>

                  {/* Available Time Slots Bar */}
                  <div className="rest-slots-row">
                    <span className="slot-label">Today's Openings:</span>
                    <div className="slots-pills">
                      {rest.slots.map(slot => (
                        <button
                          key={slot}
                          className="time-slot-btn"
                          onClick={() => {
                            setSelectedTime(slot);
                            handleOpenBooking(rest);
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    className="reserve-table-btn"
                    onClick={() => handleOpenBooking(rest)}
                  >
                    <span>Reserve a Table</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Reservation Modal */}
      {activeModalRestaurant && (
        <div className="booking-modal-backdrop">
          <div className="booking-modal-window">
            <button 
              className="modal-close-btn"
              onClick={() => setActiveModalRestaurant(null)}
            >
              ×
            </button>

            {/* Step 1 & 2: Date, Time, Seating */}
            {bookingStep === 1 && (
              <div className="modal-step-view">
                <div className="modal-header">
                  <span className="modal-sub">Table Reservation</span>
                  <h3 className="modal-rest-name">{activeModalRestaurant.name}</h3>
                  <div className="modal-meta-row">
                    <span>{activeModalRestaurant.location}</span>
                    <span>•</span>
                    <span>{activeModalRestaurant.price}</span>
                  </div>
                </div>

                <div className="modal-field-group">
                  <label className="field-lbl">Number of Guests</label>
                  <div className="guest-selector-pills">
                    {[1, 2, 3, 4, 5, 6, 8].map(num => (
                      <button
                        key={num}
                        className={`guest-pill ${guestCount === num ? 'selected' : ''}`}
                        onClick={() => setGuestCount(num)}
                      >
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-fields-row">
                  <div className="modal-field-group">
                    <label className="field-lbl">Reservation Date</label>
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="modal-input"
                    />
                  </div>
                  <div className="modal-field-group">
                    <label className="field-lbl">Dining Atmosphere</label>
                    <select 
                      value={seatingArea}
                      onChange={(e) => setSeatingArea(e.target.value)}
                      className="modal-input"
                    >
                      <option>Main Dining Room</option>
                      <option>Chef's Counter (Interactive)</option>
                      <option>Candlelit Garden Terrace</option>
                      <option>Private Sommelier Cellar</option>
                    </select>
                  </div>
                </div>

                <div className="modal-field-group">
                  <label className="field-lbl">Available Table Times</label>
                  <div className="time-picker-grid">
                    {activeModalRestaurant.slots.map(t => (
                      <button
                        key={t}
                        className={`time-pick-btn ${selectedTime === t ? 'active' : ''}`}
                        onClick={() => setSelectedTime(t)}
                      >
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  className="modal-next-btn"
                  onClick={() => setBookingStep(2)}
                >
                  <span>Continue to Guest Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Step 2: Guest Information */}
            {bookingStep === 2 && (
              <form onSubmit={handleConfirmReservation} className="modal-step-view">
                <div className="modal-header">
                  <span className="modal-sub">Final Step</span>
                  <h3 className="modal-rest-name">Guest & Contact Information</h3>
                  <p className="summary-pill">
                    {guestCount} Guests • {selectedDate} at {selectedTime} • {seatingArea}
                  </p>
                </div>

                <div className="modal-fields-row">
                  <div className="modal-field-group">
                    <label className="field-lbl">Primary Guest Name *</label>
                    <input 
                      type="text" 
                      required
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                      className="modal-input"
                    />
                  </div>
                  <div className="modal-field-group">
                    <label className="field-lbl">Mobile Phone *</label>
                    <input 
                      type="tel" 
                      required
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                      className="modal-input"
                    />
                  </div>
                </div>

                <div className="modal-field-group">
                  <label className="field-lbl">Confirmation Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div className="modal-field-group">
                  <label className="field-lbl">Special Requests / Allergies / Occasions</label>
                  <textarea 
                    rows={2}
                    value={guestInfo.dietary}
                    onChange={(e) => setGuestInfo({ ...guestInfo, dietary: e.target.value })}
                    className="modal-input"
                    placeholder="e.g. Vegetarian, celebrating 5th anniversary, quiet table..."
                  />
                </div>

                <div className="modal-btn-row">
                  <button 
                    type="button" 
                    className="modal-back-action"
                    onClick={() => setBookingStep(1)}
                  >
                    Back
                  </button>
                  <button type="submit" className="modal-confirm-btn">
                    <span>Confirm Reservation</span>
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Confirmed Boarding Pass */}
            {bookingStep === 3 && (
              <div className="modal-step-view text-center">
                <div className="confirmed-check-ring">
                  <Check className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="confirmed-title">Reservation Guaranteed</h3>
                <p className="confirmed-sub">
                  Your table at <strong>{activeModalRestaurant.name}</strong> is locked in.
                </p>

                {/* Digital Dining Pass */}
                <div className="dining-pass-card">
                  <div className="pass-header">
                    <span>OFFICIAL DINING PASS</span>
                    <strong>{confirmedBookingId}</strong>
                  </div>
                  <div className="pass-body">
                    <div className="pass-row">
                      <span>Restaurant</span>
                      <strong>{activeModalRestaurant.name}</strong>
                    </div>
                    <div className="pass-row">
                      <span>Date & Time</span>
                      <strong>{selectedDate} • {selectedTime}</strong>
                    </div>
                    <div className="pass-row">
                      <span>Party Size & Area</span>
                      <strong>{guestCount} Guests • {seatingArea}</strong>
                    </div>
                    <div className="pass-row">
                      <span>Guest Name</span>
                      <strong>{guestInfo.name}</strong>
                    </div>
                  </div>
                  <div className="pass-footer">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 mr-1" />
                    <span>Instant SMS & Email confirmation sent to {guestInfo.email}</span>
                  </div>
                </div>

                <button 
                  className="modal-done-btn"
                  onClick={() => setActiveModalRestaurant(null)}
                >
                  Close & Return to Restaurants
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
