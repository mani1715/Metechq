import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Send, CheckCircle, AlertCircle, Video, Phone } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { bookingService } from '../services';

const BookingSection = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingSettings, setBookingSettings] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_date: '',
    preferred_time_slot: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBookingSettings();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchBookingSettings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBookingSettings();
      setBookingSettings(data);
    } catch (error) {
      console.error('Error fetching booking settings:', error);
      toast.error('Booking system is currently unavailable');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const slots = await bookingService.getAvailableSlots(date, 1);
      // Filter slots for the selected date
      const dateSlotsOnly = slots.filter(slot => slot.date === date);
      setAvailableSlots(dateSlotsOnly);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days in advance
    return maxDate.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      newErrors.phone = 'Valid phone number is required';
    }

    if (!formData.preferred_date) {
      newErrors.preferred_date = 'Please select a date';
    }

    if (!formData.preferred_time_slot) {
      newErrors.preferred_time_slot = 'Please select a time slot';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'preferred_date') {
      setSelectedDate(value);
      setFormData({ ...formData, preferred_date: value, preferred_time_slot: '' });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);

    try {
      await bookingService.createBooking(formData);

      setSuccess(true);
      toast.success('Booking Request Submitted!', {
        description: 'We will confirm your booking via email within 24 hours.'
      });

      // Reset form
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          preferred_date: '',
          preferred_time_slot: '',
          message: ''
        });
        setSelectedDate('');
        setAvailableSlots([]);
        setSuccess(false);
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to submit booking. Please try again.';
      toast.error('Booking Failed', {
        description: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!bookingSettings || !bookingSettings.is_active) {
    return null; // Don't show booking section if disabled
  }

  const availableTimeSlots = availableSlots.filter(slot => slot.is_available);

  return (
    <section className="booking-section-wrapper py-16 bg-gradient-to-br from-brand-50 via-white to-brand-50" data-testid="booking-section">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Free Consultation Available</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Book a Free Consultation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Schedule a one-on-one consultation to discuss your project requirements and get expert advice.
          </p>
        </div>

        {/* Booking Form Card */}
        <Card className="p-6 md:p-8 shadow-xl border-0 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="booking-form">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <Label htmlFor="booking-name" className="text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </Label>
                <Input
                  id="booking-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                  data-testid="booking-name-input"
                />
                {errors.name && (
                  <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="booking-email" className="text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </Label>
                <Input
                  id="booking-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                  data-testid="booking-email-input"
                />
                {errors.email && (
                  <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="booking-phone" className="text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </Label>
              <Input
                id="booking-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                data-testid="booking-phone-input"
              />
              {errors.phone && (
                <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Picker */}
              <div>
                <Label htmlFor="booking-date" className="text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </Label>
                <Input
                  id="booking-date"
                  name="preferred_date"
                  type="date"
                  min={getMinDate()}
                  max={getMaxDate()}
                  value={formData.preferred_date}
                  onChange={handleChange}
                  className={`mt-1 ${errors.preferred_date ? 'border-red-500' : ''}`}
                  data-testid="booking-date-input"
                />
                {errors.preferred_date && (
                  <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.preferred_date}
                  </span>
                )}
              </div>

              {/* Time Slot */}
              <div>
                <Label htmlFor="booking-time" className="text-sm font-medium text-gray-700 mb-2">
                  Preferred Time Slot *
                </Label>
                <select
                  id="booking-time"
                  name="preferred_time_slot"
                  value={formData.preferred_time_slot}
                  onChange={handleChange}
                  className={`w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 ${errors.preferred_time_slot ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={!selectedDate}
                  data-testid="booking-time-select"
                >
                  <option value="">
                    {!selectedDate ? 'Select a date first' : 'Select time slot'}
                  </option>
                  {availableTimeSlots.map((slot) => (
                    <option key={slot.time_slot} value={slot.time_slot}>
                      {slot.time_slot} IST ({slot.available_spots} spot{slot.available_spots > 1 ? 's' : ''} available)
                    </option>
                  ))}
                  {selectedDate && availableTimeSlots.length === 0 && (
                    <option disabled>No slots available for this date</option>
                  )}
                </select>
                {errors.preferred_time_slot && (
                  <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.preferred_time_slot}
                  </span>
                )}
              </div>
            </div>

            {/* Meeting Type Display */}
            <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                {bookingSettings.meeting_type === 'Google Meet' ? (
                  <Video className="w-5 h-5 text-brand-600" />
                ) : (
                  <Phone className="w-5 h-5 text-brand-600" />
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Meeting Type: {bookingSettings.meeting_type}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {bookingSettings.meeting_type === 'Google Meet'
                      ? 'We will send you a Google Meet link via email after confirmation'
                      : 'We will call you on the provided phone number'
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="booking-message" className="text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </Label>
              <Textarea
                id="booking-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project or any specific topics you'd like to discuss..."
                rows={4}
                maxLength={500}
                className="mt-1"
                data-testid="booking-message-textarea"
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formData.message.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting || success}
              className={`w-full py-6 text-lg font-semibold transition-all ${
                success
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-brand-600 hover:bg-brand-700'
              }`}
              data-testid="booking-submit-btn"
            >
              {success ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Booking Request Sent!
                </>
              ) : submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Book Consultation
                  <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Info Note */}
          <div className="mt-6 bg-brand-50 border border-brand-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-brand-900">
                <strong>Important:</strong> All times are in Indian Standard Time (IST).
                We will confirm your booking via email within 24 hours.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default BookingSection;
