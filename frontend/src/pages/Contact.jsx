import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { contactService, contactPageService } from '../services';
import PricingCalculator from '../components/PricingCalculator';
import BookingSection from '../components/BookingSection';
import { trackPageView, trackContactSubmission } from '../services/analytics';

const Contact = () => {
  const [contactConfig, setContactConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
    consent: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [priceEstimate, setPriceEstimate] = useState(null);

  useEffect(() => {
    fetchContactPageContent();
    // Track page view
    trackPageView('contact');
  }, []);

  const fetchContactPageContent = async () => {
    try {
      setLoading(true);
      const data = await contactPageService.getContactPage();
      // Refresh legacy default copy while preserving administrator-written content.
      const copyUpdates = {
        'Get in Touch': 'Let’s build your next chapter.',
        "Let's discuss your project and bring your vision to life": 'A clear brief. A thoughtful solution. A website that works for you.',
        "Join 35+ satisfied clients who have transformed their businesses with our solutions": 'Tell us what your business needs. We’ll help you define the right next step.',
        "Join 10+ satisfied clients who have transformed their businesses with our solutions": 'Tell us what your business needs. We’ll help you define the right next step.'
      };
      setContactConfig({ ...data,
        hero: { ...data.hero, title: copyUpdates[data.hero.title] || data.hero.title,
          subtitle: copyUpdates[data.hero.subtitle] || data.hero.subtitle },
        cta: { ...data.cta, description: copyUpdates[data.cta.description] || data.cta.description }
      });
    } catch (error) {
      console.error('Error fetching contact page content:', error);

      // PERMANENT FIX: Use fallback default content if API fails
      const fallbackContent = getDefaultContactContent();
      setContactConfig(fallbackContent);


    } finally {
      setLoading(false);
    }
  };

  // Fallback default content that matches backend
  const getDefaultContactContent = () => {
    return {
      "id": "fallback-" + Date.now(),
      "hero": {
        "title": "Let’s build your next chapter.",
        "subtitle": "A clear brief. A thoughtful solution. A website that works for you.",
        "description": "We're here to help you transform your ideas into reality. Reach out and let's start building something amazing together.",
        "breadcrumbs": [
          { label: 'Home', path: '/' },
          { label: 'Contact', path: '/contact' }
        ]
      },
      "form": {
        "title": "Send Us a Message",
        "subtitle": "Fill out the form below and we'll get back to you within 24 hours",
        "fields": {
          "fullName": {
            "label": "Full Name",
            "placeholder": "John Doe",
            "required": true,
            "type": "text"
          },
          "email": {
            "label": "Email Address",
            "placeholder": "john@example.com",
            "required": true,
            "type": "email"
          },
          "phone": {
            "label": "Phone Number",
            "placeholder": "+1 (555) 123-4567",
            "required": false,
            "type": "tel"
          },
          "service": {
            "label": "Service Interested In",
            "placeholder": "Select a service",
            "required": true,
            "type": "select",
            "options": [
              {"value": "", "label": "Select a service"},
              {"value": "website", "label": "Website Development"},
              {"value": "ecommerce", "label": "E-commerce Solutions"},
              {"value": "fullstack", "label": "Full Stack Development"},
              {"value": "uiux", "label": "UI/UX Design"},
              {"value": "consulting", "label": "Technical Consulting"},
              {"value": "other", "label": "Other Services"}
            ]
          },
          "budget": {
            "label": "Project Budget (Optional)",
            "placeholder": "Select your budget range",
            "required": false,
            "type": "select",
            "options": [
              {"value": "", "label": "Select budget range"},
              {"value": "small", "label": "Under $5,000"},
              {"value": "medium", "label": "$5,000 - $15,000"},
              {"value": "large", "label": "$15,000 - $50,000"},
              {"value": "enterprise", "label": "$50,000+"},
              {"value": "discuss", "label": "Let's Discuss"}
            ]
          },
          "message": {
            "label": "Message",
            "placeholder": "Tell us about your project, goals, and timeline...",
            "required": true,
            "type": "textarea",
            "rows": 6
          },
          "consent": {
            "label": "I agree to be contacted about this enquiry. See Security & Privacy for how information is handled.",
            "required": true,
            "type": "checkbox"
          }
        },
        "submitButton": {
          "text": "Send Message",
          "loadingText": "Sending...",
          "successText": "Message Sent!"
        },
        "messages": {
          "success": {
            "title": "Message Sent Successfully!",
            "description": "Thank you for contacting us. We'll get back to you within 24 hours."
          },
          "error": {
            "title": "Oops! Something went wrong",
            "description": "Please check your information and try again."
          }
        }
      },
      "contactInfo": {
        "title": "Contact Information",
        "subtitle": "Feel free to reach out through any of these channels. We're here to help!",
        "cards": [
          {
            "id": 1,
            "icon": "Mail",
            "label": "Email Address",
            "value": "ettelamaneesh@gmail.com",
            "href": "mailto:ettelamaneesh@gmail.com",
            "description": "Send us an email anytime"
          },
          {
            "id": 2,
            "icon": "Phone",
            "label": "Phone Number",
            "value": "+91 8328284501",
            "href": "tel:+918328284501",
            "description": "Available Mon-Sat, 9 AM - 6 PM"
          },
          {
            "id": 3,
            "icon": "Clock",
            "label": "Business Hours",
            "value": "Mon - Sat: 9 AM - 6 PM",
            "description": "We typically respond within 24 hours"
          },
          {
            "id": 4,
            "icon": "MapPin",
            "label": "Location",
            "value": "India",
            "description": "Serving clients worldwide"
          }
        ]
      },
      "businessHours": {
        "title": "Business Hours",
        "schedule": [
          {"day": "Monday - Friday", "hours": "9:00 AM - 6:00 PM", "available": true},
          {"day": "Saturday", "hours": "10:00 AM - 4:00 PM", "available": true},
          {"day": "Sunday", "hours": "Closed", "available": false}
        ],
        "timezone": "IST (Indian Standard Time)",
        "note": "We respond to all inquiries within 24 business hours"
      },
      "faq": {
        "title": "Frequently Asked Questions",
        "subtitle": "Quick answers to common questions about working with us",
        "questions": [
          {
            "id": 1,
            "question": "What is your typical response time?",
            "answer": "We aim to respond to all inquiries within 24 business hours. For urgent matters, please mention it in your message and we'll prioritize accordingly."
          },
          {
            "id": 2,
            "question": "How long does a typical project take?",
            "answer": "Project timelines vary based on complexity and scope. A simple website takes 2-3 weeks, while complex e-commerce or full-stack applications can take 6-12 weeks. We'll provide a detailed timeline after discussing your requirements."
          },
          {
            "id": 3,
            "question": "What is your pricing model?",
            "answer": "We offer flexible pricing based on project requirements: fixed-price for well-defined projects, hourly rates for ongoing work, and retainer packages for long-term partnerships. We provide detailed quotes after understanding your needs."
          },
          {
            "id": 4,
            "question": "Do you provide support after project delivery?",
            "answer": "Yes! All projects include 30 days of free post-launch support for bug fixes and minor adjustments. We also offer ongoing maintenance packages for continuous support, updates, and enhancements."
          },
          {
            "id": 5,
            "question": "Can you work with existing projects?",
            "answer": "Absolutely! We can take over existing projects, add new features, fix issues, or provide consultation on improvements. We'll review your codebase and provide recommendations."
          }
        ]
      },
      "cta": {
        "title": "Ready to Start Your Project?",
        "subtitle": "Let's turn your vision into reality",
        "description": "Tell us what your business needs. We’ll help you define the right next step.",
        "primaryButton": {
          "text": "Request a Quote",
          "link": "#contact-form"
        },
        "secondaryButton": {
          "text": "View Portfolio",
          "link": "/portfolio"
        },
        "stats": [
          {"value": "10+", "label": "Happy Clients"},
          {"value": "10+", "label": "Projects Delivered"},
          {"value": "24hrs", "label": "Response Time"}
        ]
      }
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || isSuccess) return;
    if (!validateForm()) {
      toast.error(contactConfig.form.messages.error.title, {
        description: 'Please fix the errors in the form'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Append pricing estimate to message if available
      let finalMessage = formData.message;

      if (priceEstimate) {
        finalMessage += `\n\n--- Project Estimate ---\n`;
        finalMessage += `Website Type: ${priceEstimate.websiteType || 'Not selected'}\n`;
        finalMessage += `Technologies: ${priceEstimate.technologies.length > 0 ? priceEstimate.technologies.join(', ') : 'None selected'}\n`;
        finalMessage += `Features: ${priceEstimate.features.length > 0 ? priceEstimate.features.join(', ') : 'None selected'}\n`;
        finalMessage += `Timeline: ${priceEstimate.timeline || 'Not selected'}\n`;
        finalMessage += `Estimated Cost: ${priceEstimate.estimatedCost}\n`;
      }

      // Submit to backend API
      await contactService.submitContact({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        service: formData.service,
        budget: formData.budget,
        consent: formData.consent,
        message: finalMessage
      });

      // Track contact submission
      trackContactSubmission();

      setIsSuccess(true);

      toast.success(contactConfig.form.messages.success.title, {
        description: contactConfig.form.messages.success.description
      });

    } catch (error) {
      toast.error('Submission Failed', {
        description: 'Failed to submit contact form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const scrollToForm = (e) => {
    e.preventDefault();
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!contactConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Failed to load contact page content.</p>
      </div>
    );
  }

  // Add breadcrumbs to config if not present
  if (!contactConfig.hero.breadcrumbs) {
    contactConfig.hero.breadcrumbs = [
      { label: 'Home', path: '/' },
      { label: 'Contact', path: '/contact' }
    ];
  }

  return (
    <div className="contact-page-premium">
      {/* Contact Hero */}
      <section className="contact-hero-premium" data-testid="contact-hero">
        <div className="contact-hero-background"></div>
        <div className="contact-hero-container">
          {/* Breadcrumbs */}
          <nav className="breadcrumbs" data-testid="breadcrumbs" aria-label="Breadcrumb">
            {contactConfig.hero.breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="breadcrumb-separator" />}
                <Link
                  to={crumb.path}
                  className="breadcrumb-link"
                  aria-current={index === contactConfig.hero.breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          <div className="contact-hero-content">
            <h1 className="contact-hero-title" data-testid="contact-hero-title">
              {contactConfig.hero.title}
            </h1>
            <p className="contact-hero-subtitle" data-testid="contact-hero-subtitle">
              {contactConfig.hero.subtitle}
            </p>
            <p className="contact-hero-description">
              {contactConfig.hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-main-section">
        <div className="contact-content-wrapper">

          {/* Two Column Layout: Form (Left) + Business Hours (Right) */}
          <div className="enquiry-layout">

            {/* Contact Form - Left Side (50% width) */}
            <div className="lg:col-span-1" id="contact-form">
              <Card className="contact-form-card-premium" data-testid="contact-form-card">
                <div className="form-header">
                  <h2 className="form-title" data-testid="form-title">
                    {contactConfig.form.title}
                  </h2>
                  <p className="form-subtitle">{contactConfig.form.subtitle}</p>
                </div>

                {isSuccess && <div className="enquiry-success" role="status"><CheckCircle size={24}/><h3>Your enquiry is with us.</h3><p>Thank you, {formData.fullName}. We’ll reply to {formData.email} about your project.</p><button type="button" onClick={() => { setIsSuccess(false); setFormData({ fullName: '', email: '', phone: '', service: '', budget: '', message: '', consent: false }); }}>Send another enquiry</button></div>}
                {!isSuccess && <form onSubmit={handleSubmit} className="contact-form-premium" noValidate>
                {/* Full Name */}
                <div className="form-group">
                  <Label htmlFor="fullName" className="form-label">
                    {contactConfig.form.fields.fullName.label} *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={contactConfig.form.fields.fullName.placeholder}
                    className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                    aria-invalid={errors.fullName ? 'true' : 'false'}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    data-testid="input-fullname"
                  />
                  {errors.fullName && (
                    <span className="error-message" id="fullName-error" role="alert">
                      <AlertCircle className="error-icon" />
                      {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <Label htmlFor="email" className="form-label">
                    {contactConfig.form.fields.email.label} *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={contactConfig.form.fields.email.placeholder}
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    data-testid="input-email"
                  />
                  {errors.email && (
                    <span className="error-message" id="email-error" role="alert">
                      <AlertCircle className="error-icon" />
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <Label htmlFor="phone" className="form-label">
                    {contactConfig.form.fields.phone.label}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={contactConfig.form.fields.phone.placeholder}
                    className="form-input"
                    data-testid="input-phone"
                  />
                </div>

                {/* Service */}
                <div className="form-group">
                  <Label htmlFor="service" className="form-label">
                    {contactConfig.form.fields.service.label} *
                  </Label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={`form-select ${errors.service ? 'input-error' : ''}`}
                    aria-invalid={errors.service ? 'true' : 'false'}
                    aria-describedby={errors.service ? 'service-error' : undefined}
                    data-testid="select-service"
                  >
                    {contactConfig.form.fields.service.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <span className="error-message" id="service-error" role="alert">
                      <AlertCircle className="error-icon" />
                      {errors.service}
                    </span>
                  )}
                </div>

                {/* Budget */}
                <div className="form-group">
                  <Label htmlFor="budget" className="form-label">
                    {contactConfig.form.fields.budget.label}
                  </Label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="form-select"
                    data-testid="select-budget"
                  >
                    {contactConfig.form.fields.budget.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="form-group">
                  <Label htmlFor="message" className="form-label">
                    {contactConfig.form.fields.message.label} *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={contactConfig.form.fields.message.placeholder}
                    rows={contactConfig.form.fields.message.rows}
                    className={`form-textarea ${errors.message ? 'input-error' : ''}`}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    data-testid="textarea-message"
                  />
                  {errors.message && (
                    <span className="error-message" id="message-error" role="alert">
                      <AlertCircle className="error-icon" />
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Consent Checkbox */}
                <div className="form-group-checkbox">
                  <div className="checkbox-wrapper">
                    <Checkbox
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) =>
                        handleChange({ target: { name: 'consent', type: 'checkbox', checked } })
                      }
                      className={errors.consent ? 'checkbox-error' : ''}
                      aria-invalid={errors.consent ? 'true' : 'false'}
                      aria-describedby={errors.consent ? 'consent-error' : undefined}
                      data-testid="checkbox-consent"
                    />
                    <Label htmlFor="consent" className="checkbox-label">
                      I agree to be contacted about this enquiry. <Link to="/security">Read Security & Privacy</Link>
                    </Label>
                  </div>
                  {errors.consent && (
                    <span className="error-message" id="consent-error" role="alert">
                      <AlertCircle className="error-icon" />
                      {errors.consent}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className={`submit-button-premium ${isSubmitting ? 'loading' : ''} ${isSuccess ? 'success' : ''}`}
                  disabled={isSubmitting}
                  data-testid="submit-button"
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle className="button-icon" />
                      {contactConfig.form.submitButton.successText}
                    </>
                  ) : isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      {contactConfig.form.submitButton.loadingText}
                    </>
                  ) : (
                    <>
                      {contactConfig.form.submitButton.text}
                      <Send className="button-icon ml-2" />
                    </>
                  )}
                </Button>
              </form>}
            </Card>
          </div>

          {/* Business Hours & Contact Info - Right Side (50% width) */}
          <div className="lg:col-span-1 space-y-4">
            {/* Business Hours Card */}
            <Card className="business-hours-card" data-testid="business-hours-card">
              <div className="enquiry-next"><span className="enquiry-eyebrow">THE NEXT STEP</span><h2>Good work starts with a conversation.</h2><p>Share your goals, audience and timeline. We’ll review your brief and discuss scope, approach and a quote before work begins.</p><ol><li><strong>01 · Tell us your idea</strong><span>A new website, a redesign or a product to build.</span></li><li><strong>02 · Shape the scope</strong><span>We’ll clarify priorities, deliverables and timing.</span></li><li><strong>03 · Build with visibility</strong><span>Follow agreed work through your client workspace.</span></li></ol><a href="mailto:ettelamaneesh@gmail.com">ettelamaneesh@gmail.com ↗</a></div>
              <h3 className="business-hours-title">{contactConfig.businessHours.title}</h3>
              <div className="business-hours-list">
                {contactConfig.businessHours.schedule.map((schedule, index) => (
                  <div
                    key={index}
                    className={`business-hours-item ${schedule.available ? 'available' : 'unavailable'}`}
                  >
                    <span className="day">{schedule.day}</span>
                    <span className="hours">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              <div className="business-hours-note">
                <Clock className="note-icon" />
                <span>{contactConfig.businessHours.note}</span>
              </div>

              {/* Contact Info in sidebar */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
                {contactConfig.contactInfo.cards.map((card) => {
                  const IconComponent = {
                    Mail,
                    Phone,
                    Clock,
                    MapPin
                  }[card.icon] || Mail;
                  if (card.icon === 'Mail') card = { ...card, value: 'ettelamaneesh@gmail.com', href: 'mailto:ettelamaneesh@gmail.com' };

                  return (
                    <div key={card.id} className="flex items-start gap-3" data-testid={`contact-info-${card.id}`}>
                      <div className="flex-shrink-0 w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-brand-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{card.label}</p>
                        {card.href ? (
                          <a href={card.href} className="text-sm text-brand-600 hover:text-brand-700 break-words">
                            {card.value}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-600">{card.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          </div>
          {/* End of Grid */}

        </div>

        {/* Booking Section - Added between contact form and pricing calculator */}
        <details className="enquiry-extra"><summary>Prefer a scheduled conversation?</summary><BookingSection /></details>

        {/* Pricing Calculator - At the Bottom (Full Width) */}
        <div className="contact-content-wrapper">
          <details className="enquiry-extra"><summary>Explore an indicative project estimate</summary><p>Estimates help start the discussion. Final scope and pricing are agreed together. Calculate before submitting to include the estimate with your enquiry.</p><PricingCalculator onEstimateChange={setPriceEstimate} /></details>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" data-testid="faq-section">
        <div className="faq-container">
          <div className="faq-header">
            <h2 className="faq-title" data-testid="faq-title">
              {contactConfig.faq.title}
            </h2>
            <p className="faq-subtitle">{contactConfig.faq.subtitle}</p>
          </div>

          <div className="faq-list">
            {contactConfig.faq.questions.map((faq) => (
              <Card
                key={faq.id}
                className={`faq-item ${openFaqId === faq.id ? 'open' : ''}`}
                data-testid={`faq-item-${faq.id}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={openFaqId === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                  data-testid={`faq-question-${faq.id}`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`faq-icon ${openFaqId === faq.id ? 'rotate' : ''}`} />
                </button>
                {openFaqId === faq.id && (
                  <div
                    className="faq-answer"
                    id={`faq-answer-${faq.id}`}
                    data-testid={`faq-answer-${faq.id}`}
                  >
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta-section" data-testid="cta-section">
        <div className="contact-cta-background"></div>
        <div className="contact-cta-container">
          <div className="contact-cta-content">
            <div className="cta-badge">
              <Sparkles className="badge-icon" />
              <span>Let's Build Together</span>
            </div>
            <h2 className="contact-cta-title" data-testid="cta-title">
              {contactConfig.cta.title}
            </h2>
            <p className="contact-cta-subtitle">{contactConfig.cta.subtitle}</p>
            <p className="contact-cta-description">{contactConfig.cta.description}</p>

            <div className="contact-cta-buttons">
              <a href={contactConfig.cta.primaryButton.link} onClick={scrollToForm}>
                <Button className="cta-primary-button" data-testid="cta-primary-button">
                  {contactConfig.cta.primaryButton.text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Link to={contactConfig.cta.secondaryButton.link}>
                <Button className="cta-secondary-button" data-testid="cta-secondary-button">
                  {contactConfig.cta.secondaryButton.text}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
