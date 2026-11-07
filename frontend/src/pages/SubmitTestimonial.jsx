import React, { useState } from 'react';
import { Star, CheckCircle, Send } from 'lucide-react';
import api from '../services/api';

const SubmitTestimonial = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    email: '',
    message: '',
    rating: 5
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim() || formData.name.length < 2) {
      setError('Please enter your full name (at least 2 characters)');
      setLoading(false);
      return;
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      setError('Please write a testimonial (at least 10 characters)');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/testimonials/submit', {
        name: formData.name.trim(),
        role: formData.role.trim() || null,
        company: formData.company.trim() || null,
        email: formData.email.trim() || null,
        message: formData.message.trim(),
        rating: formData.rating
      });

      if (response.status === 201) {
        setSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          role: '',
          company: '',
          email: '',
          message: '',
          rating: 5
        });
      }
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      setError(err.response?.data?.detail || 'Failed to submit testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-700">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-500 rounded-full p-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
          <p className="text-gray-300 mb-6">
            Your testimonial has been submitted successfully and is now pending review.
            We appreciate you taking the time to share your experience!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Submit Another Testimonial
          </button>
          <div className="mt-4">
            <a
              href="/"
              className="text-brand-400 hover:text-brand-300 transition-colors duration-200"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Share Your Experience
          </h1>
          <p className="text-xl text-gray-300">
            We'd love to hear about your experience working with us!
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Role and Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="CEO, Marketing Director, etc."
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Your Company"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll use this to verify your testimonial and may reach out for permission to use your logo
              </p>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || formData.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                      } transition-colors duration-150`}
                    />
                  </button>
                ))}
                <span className="ml-4 text-lg text-gray-300 font-medium">
                  {formData.rating} {formData.rating === 1 ? 'Star' : 'Stars'}
                </span>
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Your Testimonial <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                placeholder="Share your experience working with us... (minimum 10 characters)"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length}/1000 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                loading
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-700 hover:to-brand-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Testimonial</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-400">
              Your testimonial will be reviewed before being published on our website.
            </p>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-brand-400 hover:text-brand-300 transition-colors duration-200"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubmitTestimonial;
