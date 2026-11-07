import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, User, Mail, Phone, Clock, Star, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { getBackendURL } from '../lib/utils';

const BACKEND_URL = getBackendURL();

const Chat = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testimonialData, setTestimonialData] = useState({
    role: '',
    company: '',
    message: '',
    rating: 5
  });
  const [testimonialSubmitted, setTestimonialSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);
  const lastFetchRef = useRef(0);

  // Optimized scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Optimized fetch conversation with debouncing
  const fetchConversation = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchRef.current < 1000) return; // Debounce 1s
    lastFetchRef.current = now;

    try {
      const response = await axios.get(
        `${BACKEND_URL}/chat/user-conversation`,
        {
          params: {
            email: userInfo.email,
            phone: userInfo.phone || ''
          }
        }
      );

      if (response.data.success) {
        setConversation(response.data.conversation);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      // Don't show error for background fetches
    }
  }, [userInfo.email, userInfo.phone]);

  // Check localStorage on mount
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('chat_user_info');
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo);
        setUserInfo(parsed);
        setIsAuthenticated(true);
        // Fetch initial conversation
        setTimeout(() => {
          fetchConversation();
        }, 100);
      } catch (e) {
        localStorage.removeItem('chat_user_info');
      }
    }
  }, []);

  // Auto-refresh with cleanup
  useEffect(() => {
    if (isAuthenticated && userInfo.email) {
      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Set new interval for 5 seconds
      intervalRef.current = setInterval(() => {
        fetchConversation();
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isAuthenticated, userInfo.email, fetchConversation]);

  // Scroll when conversation changes
  useEffect(() => {
    if (conversation?.messages?.length) {
      scrollToBottom();
    }
  }, [conversation, scrollToBottom]);

  const authenticateUser = async (info) => {
    if (!info.name || !info.email) {
      setError('Name and email are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${BACKEND_URL}/chat/user-conversation`,
        {
          params: {
            email: info.email,
            phone: info.phone || ''
          },
          timeout: 10000 // 10s timeout
        }
      );

      if (response.data.success) {
        setConversation(response.data.conversation);
      }
      setIsAuthenticated(true);
      localStorage.setItem('chat_user_info', JSON.stringify(info));
    } catch (error) {
      console.error('Error authenticating:', error);
      if (error.response?.status === 404) {
        // No conversation yet, but user can start one
        setIsAuthenticated(true);
        localStorage.setItem('chat_user_info', JSON.stringify(info));
      } else {
        setError('Failed to load chat. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!userInfo.name?.trim() || !userInfo.email?.trim()) {
      setError('Name and email are required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      setError('Please enter a valid email address');
      return;
    }

    authenticateUser(userInfo);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setLoading(true);
    setError('');
    const tempMessage = trimmedMessage;
    setMessage(''); // Clear immediately for better UX

    try {
      await axios.post(
        `${BACKEND_URL}/chat/messages`,
        {
          customer_name: userInfo.name,
          customer_email: userInfo.email,
          customer_phone: userInfo.phone || '',
          message: tempMessage
        },
        { timeout: 10000 }
      );

      // Refresh conversation
      await fetchConversation();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(tempMessage); // Restore message on error
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    localStorage.removeItem('chat_user_info');
    setIsAuthenticated(false);
    setConversation(null);
    setUserInfo({ name: '', email: '', phone: '' });
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Just now';
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Just now';
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();

    if (!testimonialData.message.trim() || testimonialData.message.length < 10) {
      setError('Please write a testimonial (at least 10 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND_URL}/testimonials/submit`, {
        name: userInfo.name.trim(),
        role: testimonialData.role.trim() || null,
        company: testimonialData.company.trim() || null,
        email: userInfo.email.trim(),
        message: testimonialData.message.trim(),
        rating: testimonialData.rating
      });

      if (response.status === 201) {
        setTestimonialSubmitted(true);
        setTestimonialData({
          role: '',
          company: '',
          message: '',
          rating: 5
        });
        // Close form after 3 seconds
        setTimeout(() => {
          setShowTestimonialForm(false);
          setTestimonialSubmitted(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      setError(err.response?.data?.detail || 'Failed to submit testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    setTestimonialData(prev => ({
      ...prev,
      rating
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-brand-600 to-brand-600 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Chatting</h2>
            <p className="text-gray-600">Enter your details to continue your conversation</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="john@example.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="+1 (555) 123-4567"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-700 hover:to-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Continue to Chat'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-sm p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-brand-600" />
                Chat with METECHQ
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Logged in as {userInfo.name} ({userInfo.email})
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Switch Account
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="bg-white shadow-sm" style={{ height: '500px', overflowY: 'auto' }}>
          <div className="p-6 space-y-4">
            {conversation && conversation.messages && conversation.messages.length > 0 ? (
              conversation.messages.map((msg, index) => (
                <div
                  key={`${msg.timestamp}-${index}`}
                  className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.sender === 'customer'
                        ? 'bg-gradient-to-r from-brand-600 to-brand-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                    <div className={`flex items-center mt-1 text-xs ${
                      msg.sender === 'customer' ? 'text-brand-100' : 'text-gray-500'
                    }`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No messages yet</p>
                <p className="text-gray-400 text-sm mt-2">Start the conversation by sending a message below</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-2xl shadow-sm p-6 border-t">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* Testimonial Form */}
          {showTestimonialForm ? (
            <div className="border-2 border-brand-200 rounded-xl p-6 mb-4 bg-brand-50">
              {testimonialSubmitted ? (
                <div className="text-center py-6">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-green-500 rounded-full p-3">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">
                    Your testimonial has been submitted successfully and is now pending review.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-brand-600" />
                      Share Your Experience
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTestimonialForm(false);
                        setTestimonialData({ role: '', company: '', message: '', rating: 5 });
                        setError('');
                      }}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Role
                      </label>
                      <input
                        type="text"
                        value={testimonialData.role}
                        onChange={(e) => setTestimonialData({ ...testimonialData, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="CEO, Developer, etc."
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={testimonialData.company}
                        onChange={(e) => setTestimonialData({ ...testimonialData, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Your Company"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                          disabled={loading}
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoveredRating || testimonialData.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            } transition-colors duration-150`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-sm text-gray-600 font-medium">
                        {testimonialData.rating} {testimonialData.rating === 1 ? 'Star' : 'Stars'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Testimonial <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={testimonialData.message}
                      onChange={(e) => setTestimonialData({ ...testimonialData, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      rows="4"
                      placeholder="Share your experience with us... (minimum 10 characters)"
                      required
                      disabled={loading}
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {testimonialData.message.length}/1000 characters
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !testimonialData.message.trim()}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-700 hover:to-brand-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                </form>
              )}
            </div>
          ) : (
            /* Quick Action Button */
            <div className="mb-4">
              <button
                onClick={() => setShowTestimonialForm(true)}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-brand-100 to-brand-100 hover:from-brand-200 hover:to-brand-200 text-brand-700 border border-brand-300"
              >
                <Star className="w-5 h-5" />
                <span>Share Your Testimonial</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition disabled:opacity-50"
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-600 text-white rounded-lg hover:from-brand-700 hover:to-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="h-5 w-5" />
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
