import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Save, RotateCcw, Sparkles } from 'lucide-react';
import { getBackendURL } from '../../lib/utils';

const API_URL = getBackendURL();

const ContentEditor = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${API_URL}/api/content/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setContent({ ...content, [field]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API_URL}/api/content/`, content, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Content updated successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchContent();
    setHasChanges(false);
    toast.info('Changes discarded');
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="loading-spinner"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <Sparkles className="page-icon" />
            Content Editor
          </h1>
          <p className="admin-page-subtitle">
            Edit all website content from one place
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {hasChanges && (
            <button 
              className="admin-btn admin-btn-secondary" 
              onClick={handleReset}
              disabled={saving}
            >
              <RotateCcw size={18} />
              Discard Changes
            </button>
          )}
          <button 
            className="admin-btn admin-btn-primary" 
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="content-editor-container">
        {/* Hero Section */}
        <div className="content-section">
          <h2 className="content-section-title">🎯 Hero Section (Homepage)</h2>
          <div className="content-fields">
            <div className="content-field">
              <label>Main Headline</label>
              <input
                type="text"
                value={content.hero_headline || ''}
                onChange={(e) => handleChange('hero_headline', e.target.value)}
                placeholder="Build Your Dream Website"
              />
            </div>
            <div className="content-field">
              <label>Sub Headline</label>
              <input
                type="text"
                value={content.hero_subheadline || ''}
                onChange={(e) => handleChange('hero_subheadline', e.target.value)}
                placeholder="METECHQ Web Development Solutions"
              />
            </div>
            <div className="content-field">
              <label>Description</label>
              <textarea
                value={content.hero_description || ''}
                onChange={(e) => handleChange('hero_description', e.target.value)}
                placeholder="Transform your vision into stunning reality..."
                rows={3}
              />
            </div>
            <div className="content-field-row">
              <div className="content-field">
                <label>Button 1 Text</label>
                <input
                  type="text"
                  value={content.hero_cta1_text || ''}
                  onChange={(e) => handleChange('hero_cta1_text', e.target.value)}
                  placeholder="Start Your Project"
                />
              </div>
              <div className="content-field">
                <label>Button 2 Text</label>
                <input
                  type="text"
                  value={content.hero_cta2_text || ''}
                  onChange={(e) => handleChange('hero_cta2_text', e.target.value)}
                  placeholder="View Our Work"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="content-section">
          <h2 className="content-section-title">📊 Statistics Bar (Homepage)</h2>
          <div className="content-fields">
            <div className="stat-group">
              <h3>Stat 1: Completed Projects</h3>
              <div className="content-field-row">
                <div className="content-field">
                  <label>Value (e.g., 50+)</label>
                  <input
                    type="text"
                    value={content.stat_projects_value || ''}
                    onChange={(e) => handleChange('stat_projects_value', e.target.value)}
                    placeholder="50+"
                  />
                </div>
                <div className="content-field">
                  <label>Label</label>
                  <input
                    type="text"
                    value={content.stat_projects_label || ''}
                    onChange={(e) => handleChange('stat_projects_label', e.target.value)}
                    placeholder="Completed Projects"
                  />
                </div>
              </div>
            </div>

            <div className="stat-group">
              <h3>Stat 2: Happy Clients</h3>
              <div className="content-field-row">
                <div className="content-field">
                  <label>Value (e.g., 35+)</label>
                  <input
                    type="text"
                    value={content.stat_clients_value || ''}
                    onChange={(e) => handleChange('stat_clients_value', e.target.value)}
                    placeholder="35+"
                  />
                </div>
                <div className="content-field">
                  <label>Label</label>
                  <input
                    type="text"
                    value={content.stat_clients_label || ''}
                    onChange={(e) => handleChange('stat_clients_label', e.target.value)}
                    placeholder="Happy Clients"
                  />
                </div>
              </div>
            </div>

            <div className="stat-group">
              <h3>Stat 3: Years Experience</h3>
              <div className="content-field-row">
                <div className="content-field">
                  <label>Value (e.g., 3+)</label>
                  <input
                    type="text"
                    value={content.stat_experience_value || ''}
                    onChange={(e) => handleChange('stat_experience_value', e.target.value)}
                    placeholder="3+"
                  />
                </div>
                <div className="content-field">
                  <label>Label</label>
                  <input
                    type="text"
                    value={content.stat_experience_label || ''}
                    onChange={(e) => handleChange('stat_experience_label', e.target.value)}
                    placeholder="Years Experience"
                  />
                </div>
              </div>
            </div>

            <div className="stat-group">
              <h3>Stat 4: Client Satisfaction</h3>
              <div className="content-field-row">
                <div className="content-field">
                  <label>Value (e.g., 98%)</label>
                  <input
                    type="text"
                    value={content.stat_satisfaction_value || ''}
                    onChange={(e) => handleChange('stat_satisfaction_value', e.target.value)}
                    placeholder="98%"
                  />
                </div>
                <div className="content-field">
                  <label>Label</label>
                  <input
                    type="text"
                    value={content.stat_satisfaction_label || ''}
                    onChange={(e) => handleChange('stat_satisfaction_label', e.target.value)}
                    placeholder="Client Satisfaction"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="content-section">
          <h2 className="content-section-title">🛠️ Services Section (Homepage)</h2>
          <div className="content-fields">
            <div className="content-field">
              <label>Badge Text</label>
              <input
                type="text"
                value={content.services_badge || ''}
                onChange={(e) => handleChange('services_badge', e.target.value)}
                placeholder="Our Services"
              />
            </div>
            <div className="content-field">
              <label>Section Title</label>
              <input
                type="text"
                value={content.services_title || ''}
                onChange={(e) => handleChange('services_title', e.target.value)}
                placeholder="Premium Web Solutions"
              />
            </div>
            <div className="content-field">
              <label>Section Description</label>
              <textarea
                value={content.services_description || ''}
                onChange={(e) => handleChange('services_description', e.target.value)}
                placeholder="Comprehensive development services..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="content-section">
          <h2 className="content-section-title">💼 Portfolio Section (Homepage)</h2>
          <div className="content-fields">
            <div className="content-field">
              <label>Badge Text</label>
              <input
                type="text"
                value={content.projects_badge || ''}
                onChange={(e) => handleChange('projects_badge', e.target.value)}
                placeholder="Our Portfolio"
              />
            </div>
            <div className="content-field">
              <label>Section Title</label>
              <input
                type="text"
                value={content.projects_title || ''}
                onChange={(e) => handleChange('projects_title', e.target.value)}
                placeholder="Featured Projects"
              />
            </div>
            <div className="content-field">
              <label>Section Description</label>
              <textarea
                value={content.projects_description || ''}
                onChange={(e) => handleChange('projects_description', e.target.value)}
                placeholder="Explore our latest work..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="content-section">
          <h2 className="content-section-title">⭐ Testimonials Section (Homepage)</h2>
          <div className="content-fields">
            <div className="content-field">
              <label>Badge Text</label>
              <input
                type="text"
                value={content.testimonials_badge || ''}
                onChange={(e) => handleChange('testimonials_badge', e.target.value)}
                placeholder="Client Testimonials"
              />
            </div>
            <div className="content-field">
              <label>Section Title</label>
              <input
                type="text"
                value={content.testimonials_title || ''}
                onChange={(e) => handleChange('testimonials_title', e.target.value)}
                placeholder="What Our Clients Say"
              />
            </div>
            <div className="content-field">
              <label>Section Description</label>
              <textarea
                value={content.testimonials_description || ''}
                onChange={(e) => handleChange('testimonials_description', e.target.value)}
                placeholder="Trusted by businesses worldwide..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="content-section">
          <h2 className="content-section-title">🚀 Call-to-Action Section (Homepage)</h2>
          <div className="content-fields">
            <div className="content-field">
              <label>Main Heading</label>
              <input
                type="text"
                value={content.cta_heading || ''}
                onChange={(e) => handleChange('cta_heading', e.target.value)}
                placeholder="Let's Build Your Website"
              />
            </div>
            <div className="content-field">
              <label>Description</label>
              <textarea
                value={content.cta_description || ''}
                onChange={(e) => handleChange('cta_description', e.target.value)}
                placeholder="Ready to transform your vision..."
                rows={2}
              />
            </div>
            <div className="content-field">
              <label>Button Text</label>
              <input
                type="text"
                value={content.cta_button_text || ''}
                onChange={(e) => handleChange('cta_button_text', e.target.value)}
                placeholder="Get in Touch"
              />
            </div>
          </div>
        </div>

        {/* About Page */}
        <div className="content-section">
          <h2 className="content-section-title">ℹ️ About Page Content</h2>
          <div className="content-fields">
            <div className="content-field">
              <label>Page Title</label>
              <input
                type="text"
                value={content.about_title || ''}
                onChange={(e) => handleChange('about_title', e.target.value)}
                placeholder="About METECHQ"
              />
            </div>
            <div className="content-field">
              <label>Description</label>
              <textarea
                value={content.about_description || ''}
                onChange={(e) => handleChange('about_description', e.target.value)}
                placeholder="We are a team of passionate developers..."
                rows={3}
              />
            </div>
            <div className="content-field">
              <label>Our Mission</label>
              <textarea
                value={content.about_mission || ''}
                onChange={(e) => handleChange('about_mission', e.target.value)}
                placeholder="Our mission is to create exceptional digital experiences..."
                rows={2}
              />
            </div>
            <div className="content-field">
              <label>Our Vision</label>
              <textarea
                value={content.about_vision || ''}
                onChange={(e) => handleChange('about_vision', e.target.value)}
                placeholder="Our vision is to be the leading web development agency..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Contact Page */}
        <div className="content-section">
          <h2 className="content-section-title">📞 Contact Page Content</h2>
          <div className="content-fields">
            <div className="content-field">
              <label>Page Title</label>
              <input
                type="text"
                value={content.contact_title || ''}
                onChange={(e) => handleChange('contact_title', e.target.value)}
                placeholder="Get In Touch"
              />
            </div>
            <div className="content-field">
              <label>Description</label>
              <textarea
                value={content.contact_description || ''}
                onChange={(e) => handleChange('contact_description', e.target.value)}
                placeholder="Have a project in mind..."
                rows={2}
              />
            </div>
            <div className="content-field">
              <label>Email</label>
              <input
                type="email"
                value={content.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="info@metechq.com"
              />
            </div>
            <div className="content-field">
              <label>Phone</label>
              <input
                type="text"
                value={content.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
            <div className="content-field">
              <label>Address</label>
              <textarea
                value={content.contact_address || ''}
                onChange={(e) => handleChange('contact_address', e.target.value)}
                placeholder="123 Main Street, City, Country"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Footer */}
      {hasChanges && (
        <div className="content-save-footer">
          <p>You have unsaved changes</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="admin-btn admin-btn-secondary" onClick={handleReset}>
              Discard
            </button>
            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
