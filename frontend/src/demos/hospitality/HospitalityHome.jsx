import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Star, Wifi, Coffee, Dumbbell, Utensils, Car, Wind, Bed, Bath, Home, Check, Clock, Phone, Mail, CreditCard, ChevronRight } from 'lucide-react';
import './hospitality.css';

const HospitalityHome = () => {
  const [step, setStep] = useState(1);
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Hotels Data
  const hotels = [
    {
      id: 1,
      name: 'Grand Plaza Hotel & Spa',
      location: 'Downtown, Manhattan',
      rating: 4.8,
      reviews: 2450,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      priceRange: '$250 - $500',
      description: 'Luxury 5-star hotel with stunning city views and world-class amenities',
      amenities: ['Free WiFi', 'Spa & Wellness', 'Fitness Center', '24/7 Room Service', 'Pool', 'Restaurant', 'Bar', 'Valet Parking'],
      distance: '0.5 miles from city center',
      rooms: [
        {
          id: 'r1',
          type: 'Deluxe Room',
          price: 250,
          size: '350 sq ft',
          beds: '1 King Bed',
          maxGuests: 2,
          image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
          features: ['City View', 'King Bed', 'Work Desk', 'Mini Bar', 'Smart TV', 'Marble Bathroom'],
          available: 5
        },
        {
          id: 'r2',
          type: 'Executive Suite',
          price: 400,
          size: '650 sq ft',
          beds: '1 King Bed + Sofa Bed',
          maxGuests: 4,
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
          features: ['Panoramic View', 'Separate Living Area', 'Kitchenette', 'Premium Toiletries', 'Espresso Machine', 'Walk-in Shower'],
          available: 3
        },
        {
          id: 'r3',
          type: 'Presidential Suite',
          price: 800,
          size: '1200 sq ft',
          beds: '2 King Beds',
          maxGuests: 6,
          image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
          features: ['Penthouse View', 'Full Kitchen', 'Dining Area', 'Private Balcony', 'Jacuzzi', 'Butler Service', 'Wine Collection'],
          available: 1
        }
      ]
    },
    {
      id: 2,
      name: 'Seaside Resort & Marina',
      location: 'Beachfront, Miami',
      rating: 4.9,
      reviews: 1890,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      priceRange: '$300 - $650',
      description: 'Beachfront paradise with private beach access and water sports',
      amenities: ['Private Beach', 'Water Sports', 'Infinity Pool', 'Beach Bar', 'Spa', 'Kids Club', 'Marina', 'Tennis Courts'],
      distance: 'Beachfront property',
      rooms: [
        {
          id: 'r4',
          type: 'Ocean View Room',
          price: 300,
          size: '400 sq ft',
          beds: '2 Queen Beds',
          maxGuests: 4,
          image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
          features: ['Ocean View', 'Balcony', 'Beach Access', 'Mini Fridge', 'Coffee Maker', 'Safe'],
          available: 8
        },
        {
          id: 'r5',
          type: 'Beach Villa',
          price: 650,
          size: '900 sq ft',
          beds: '1 King Bed + 2 Twin Beds',
          maxGuests: 4,
          image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&h=600&fit=crop',
          features: ['Private Pool', 'Direct Beach Access', 'Outdoor Shower', 'BBQ Area', 'Full Kitchen', 'Terrace'],
          available: 2
        }
      ]
    },
    {
      id: 3,
      name: 'Mountain Lodge & Retreat',
      location: 'Alpine Valley, Colorado',
      rating: 4.7,
      reviews: 1320,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
      priceRange: '$200 - $450',
      description: 'Cozy mountain escape with ski-in/ski-out access and stunning views',
      amenities: ['Ski Access', 'Hot Tub', 'Fireplace Lounge', 'Restaurant', 'Game Room', 'Spa', 'Ski Rental', 'Mountain Guides'],
      distance: 'Ski slope adjacent',
      rooms: [
        {
          id: 'r6',
          type: 'Mountain View Room',
          price: 200,
          size: '320 sq ft',
          beds: '1 Queen Bed',
          maxGuests: 2,
          image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
          features: ['Mountain View', 'Fireplace', 'Heated Floors', 'Ski Storage', 'Premium Bedding', 'Bathrobe'],
          available: 6
        },
        {
          id: 'r7',
          type: 'Alpine Chalet',
          price: 450,
          size: '800 sq ft',
          beds: '2 King Beds',
          maxGuests: 6,
          image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
          features: ['Panoramic Views', 'Private Hot Tub', 'Full Kitchen', 'Wood Fireplace', 'Ski-in Access', 'Sauna'],
          available: 3
        }
      ]
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchData.location && searchData.checkIn && searchData.checkOut) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateNights = () => {
    if (searchData.checkIn && searchData.checkOut) {
      const start = new Date(searchData.checkIn);
      const end = new Date(searchData.checkOut);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    }
    return 1;
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const newBookingId = 'HB' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setBookingId(newBookingId);
    setBookingConfirmed(true);
    setStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPrice = selectedRoom ? selectedRoom.price * calculateNights() : 0;
  const taxes = totalPrice * 0.12;
  const serviceFee = 25;
  const grandTotal = totalPrice + taxes + serviceFee;

  return (
    <div className="hospitality-demo">
      {/* Navigation Bar */}
      <nav className="hospitality-nav">
        <div className="container">
          <div className="nav-content">
            <Link to="/portfolio" className="nav-back">
              <ArrowLeft size={20} />
              <span>Back to Portfolio</span>
            </Link>
            <div className="nav-brand">
              <Home className="nav-icon" />
              <span className="nav-title">LuxeStay Hotels</span>
            </div>
            <div className="nav-contact">
              <Phone size={18} />
              <span>1-800-LUXE-STAY</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Steps */}
      {step < 5 && (
        <div className="progress-container">
          <div className="container">
            <div className="progress-steps">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-circle">1</div>
                <span>Search</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <span>Select Hotel</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <span>Choose Room</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
                <div className="step-circle">4</div>
                <span>Guest Info</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Search Form */}
      {step === 1 && (
        <div className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Find Your Perfect Stay</h1>
            <p className="hero-subtitle">Discover luxury hotels and resorts around the world</p>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-grid">
                <div className="form-group">
                  <label><MapPin size={18} /> Destination</label>
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchData.location}
                    onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label><Calendar size={18} /> Check-in</label>
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label><Calendar size={18} /> Check-out</label>
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                    min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label><Users size={18} /> Guests</label>
                  <select
                    value={searchData.guests}
                    onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button type="submit" className="search-button">
                Search Hotels
                <ChevronRight size={20} />
              </button>
            </form>
          </div>
          
          {/* Features Section */}
          <div className="features-section">
            <div className="container">
              <div className="features-grid">
                <div className="feature-card">
                  <Star className="feature-icon" />
                  <h3>Verified Hotels</h3>
                  <p>All properties verified for quality and safety</p>
                </div>
                <div className="feature-card">
                  <CreditCard className="feature-icon" />
                  <h3>Best Price Guarantee</h3>
                  <p>Find a lower price? We'll match it</p>
                </div>
                <div className="feature-card">
                  <Clock className="feature-icon" />
                  <h3>24/7 Support</h3>
                  <p>Customer service available anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Hotel Selection */}
      {step === 2 && (
        <div className="container main-content">
          <div className="section-header">
            <h2>Available Hotels in {searchData.location}</h2>
            <p>{hotels.length} properties found • {calculateNights()} night{calculateNights() > 1 ? 's' : ''}</p>
          </div>
          
          <div className="hotels-grid">
            {hotels.map(hotel => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-image">
                  <img src={hotel.image} alt={hotel.name} />
                  <div className="hotel-badge">{hotel.priceRange}/night</div>
                </div>
                
                <div className="hotel-info">
                  <div className="hotel-header">
                    <h3>{hotel.name}</h3>
                    <div className="hotel-rating">
                      <Star size={16} fill="#FFC107" stroke="#FFC107" />
                      <span className="rating-score">{hotel.rating}</span>
                      <span className="rating-reviews">({hotel.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="hotel-location">
                    <MapPin size={16} />
                    <span>{hotel.location}</span>
                  </div>
                  
                  <p className="hotel-description">{hotel.description}</p>
                  
                  <div className="hotel-amenities">
                    {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                      <span key={idx} className="amenity-tag">
                        <Check size={14} /> {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    className="select-hotel-btn"
                    onClick={() => handleHotelSelect(hotel)}
                  >
                    View Rooms
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Room Selection */}
      {step === 3 && selectedHotel && (
        <div className="container main-content">
          <button className="back-btn" onClick={() => setStep(2)}>
            <ArrowLeft size={18} /> Back to Hotels
          </button>
          
          <div className="hotel-details-header">
            <div className="hotel-details-image">
              <img src={selectedHotel.image} alt={selectedHotel.name} />
            </div>
            <div className="hotel-details-info">
              <h2>{selectedHotel.name}</h2>
              <div className="hotel-rating">
                <Star size={18} fill="#FFC107" stroke="#FFC107" />
                <span className="rating-score">{selectedHotel.rating}</span>
                <span className="rating-reviews">({selectedHotel.reviews} reviews)</span>
              </div>
              <div className="hotel-location">
                <MapPin size={18} />
                <span>{selectedHotel.location}</span>
              </div>
              <p className="hotel-description">{selectedHotel.description}</p>
              
              <div className="hotel-amenities-full">
                {selectedHotel.amenities.map((amenity, idx) => (
                  <span key={idx} className="amenity-tag">
                    <Check size={14} /> {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="section-header">
            <h3>Select Your Room</h3>
            <p>Showing rates for {calculateNights()} night{calculateNights() > 1 ? 's' : ''}</p>
          </div>
          
          <div className="rooms-grid">
            {selectedHotel.rooms.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-image">
                  <img src={room.image} alt={room.type} />
                  {room.available <= 3 && (
                    <div className="room-limited">Only {room.available} left!</div>
                  )}
                </div>
                
                <div className="room-info">
                  <h3>{room.type}</h3>
                  
                  <div className="room-specs">
                    <div className="room-spec">
                      <Bed size={16} />
                      <span>{room.beds}</span>
                    </div>
                    <div className="room-spec">
                      <Users size={16} />
                      <span>Up to {room.maxGuests} guests</span>
                    </div>
                    <div className="room-spec">
                      <Home size={16} />
                      <span>{room.size}</span>
                    </div>
                  </div>
                  
                  <div className="room-features">
                    {room.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag">
                        <Check size={12} /> {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="room-pricing">
                    <div className="room-price">
                      <span className="price-label">Total for {calculateNights()} night{calculateNights() > 1 ? 's' : ''}</span>
                      <span className="price-amount">${(room.price * calculateNights()).toLocaleString()}</span>
                      <span className="price-per-night">${room.price}/night</span>
                    </div>
                    <button 
                      className="book-room-btn"
                      onClick={() => handleRoomSelect(room)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Guest Information */}
      {step === 4 && selectedRoom && (
        <div className="container main-content">
          <button className="back-btn" onClick={() => setStep(3)}>
            <ArrowLeft size={18} /> Back to Rooms
          </button>
          
          <div className="booking-layout">
            <div className="booking-form-section">
              <h2>Guest Information</h2>
              
              <form onSubmit={handleBooking} className="booking-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      placeholder="John"
                      value={guestInfo.firstName}
                      onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={guestInfo.lastName}
                      onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label><Mail size={18} /> Email Address *</label>
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label><Phone size={18} /> Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Special Requests (Optional)</label>
                  <textarea
                    placeholder="Early check-in, late checkout, specific floor, etc."
                    value={guestInfo.specialRequests}
                    onChange={(e) => setGuestInfo({...guestInfo, specialRequests: e.target.value})}
                    rows={4}
                  />
                </div>
                
                <div className="terms-section">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    I agree to the booking terms and conditions, cancellation policy, and privacy policy
                  </label>
                </div>
                
                <button type="submit" className="confirm-booking-btn">
                  Confirm Booking
                  <Check size={20} />
                </button>
              </form>
            </div>
            
            {/* Booking Summary */}
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              
              <div className="summary-hotel">
                <img src={selectedHotel.image} alt={selectedHotel.name} />
                <div>
                  <h4>{selectedHotel.name}</h4>
                  <div className="summary-rating">
                    <Star size={14} fill="#FFC107" stroke="#FFC107" />
                    <span>{selectedHotel.rating}</span>
                  </div>
                  <div className="summary-location">
                    <MapPin size={14} />
                    <span>{selectedHotel.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="summary-details">
                <div className="summary-item">
                  <span className="summary-label">Room Type</span>
                  <span className="summary-value">{selectedRoom.type}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Check-in</span>
                  <span className="summary-value">{new Date(searchData.checkIn).toLocaleDateString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Check-out</span>
                  <span className="summary-value">{new Date(searchData.checkOut).toLocaleDateString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Nights</span>
                  <span className="summary-value">{calculateNights()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Guests</span>
                  <span className="summary-value">{searchData.guests}</span>
                </div>
              </div>
              
              <div className="summary-pricing">
                <div className="pricing-item">
                  <span>Room (${selectedRoom.price} × {calculateNights()} nights)</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="pricing-item">
                  <span>Taxes & Fees (12%)</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="pricing-item">
                  <span>Service Fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="pricing-total">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="cancellation-policy">
                <h4>Cancellation Policy</h4>
                <p>Free cancellation up to 24 hours before check-in. Cancel after that and you'll be charged the first night.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Confirmation */}
      {step === 5 && bookingConfirmed && (
        <div className="container main-content">
          <div className="confirmation-card">
            <div className="confirmation-icon">
              <Check size={64} />
            </div>
            
            <h2>Booking Confirmed!</h2>
            <p className="confirmation-subtitle">Your reservation has been successfully confirmed</p>
            
            <div className="booking-id">
              <span className="id-label">Booking ID</span>
              <span className="id-value">{bookingId}</span>
            </div>
            
            <div className="confirmation-details">
              <div className="confirmation-section">
                <h3>Hotel Details</h3>
                <div className="detail-item">
                  <strong>{selectedHotel.name}</strong>
                  <span>{selectedHotel.location}</span>
                </div>
                <div className="detail-item">
                  <strong>Room Type</strong>
                  <span>{selectedRoom.type}</span>
                </div>
              </div>
              
              <div className="confirmation-section">
                <h3>Stay Details</h3>
                <div className="detail-item">
                  <strong>Check-in</strong>
                  <span>{new Date(searchData.checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="detail-time">After 3:00 PM</span>
                </div>
                <div className="detail-item">
                  <strong>Check-out</strong>
                  <span>{new Date(searchData.checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="detail-time">Before 11:00 AM</span>
                </div>
                <div className="detail-item">
                  <strong>Duration</strong>
                  <span>{calculateNights()} night{calculateNights() > 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <div className="confirmation-section">
                <h3>Guest Information</h3>
                <div className="detail-item">
                  <strong>Name</strong>
                  <span>{guestInfo.firstName} {guestInfo.lastName}</span>
                </div>
                <div className="detail-item">
                  <strong>Email</strong>
                  <span>{guestInfo.email}</span>
                </div>
                <div className="detail-item">
                  <strong>Phone</strong>
                  <span>{guestInfo.phone}</span>
                </div>
              </div>
              
              <div className="confirmation-section">
                <h3>Payment Summary</h3>
                <div className="detail-item">
                  <strong>Total Paid</strong>
                  <span className="price-highlight">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="confirmation-notice">
              <Mail size={24} />
              <p>A confirmation email has been sent to <strong>{guestInfo.email}</strong> with all booking details and check-in instructions.</p>
            </div>
            
            <div className="confirmation-actions">
              <button onClick={() => window.print()} className="btn-secondary">
                Print Confirmation
              </button>
              <Link to="/portfolio" className="btn-primary">
                Return to Portfolio
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="hospitality-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>LuxeStay Hotels</h4>
              <p>Your gateway to luxury accommodations worldwide</p>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <p><Phone size={16} /> 1-800-LUXE-STAY</p>
              <p><Mail size={16} /> info@luxestay.com</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <p>About Us</p>
              <p>Terms & Conditions</p>
              <p>Privacy Policy</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 LuxeStay Hotels. Demo project by METECHQ</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HospitalityHome;
