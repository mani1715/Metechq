import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Award, Target, Zap, Shield, Briefcase, Users, TrendingUp, Layers } from 'lucide-react';
import aboutService from '../../services/aboutService';
import { toast } from 'sonner';

const AboutManager = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [editMode, setEditMode] = useState({});

  // Icon options for values and achievements
  const iconOptions = ['Award', 'Target', 'Zap', 'Shield', 'Briefcase', 'Users', 'TrendingUp', 'Layers'];

  const iconMap = {
    Award: Award,
    Target: Target,
    Zap: Zap,
    Shield: Shield,
    Briefcase: Briefcase,
    Users: Users,
    TrendingUp: TrendingUp,
    Layers: Layers
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const data = await aboutService.getAboutContent();
      setAboutContent(data);
    } catch (error) {
      console.error('Error fetching about content:', error);
      toast.error('Failed to load About content');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    try {
      setSaving(true);

      // Ensure all values and achievements have IDs (backend will generate UUIDs for missing ones)
      const contentToSave = {
        ...aboutContent,
        values: aboutContent.values.map(v => ({
          ...v,
          id: v.id || null  // Backend will generate UUID if null
        })),
        achievements: aboutContent.achievements.map(a => ({
          ...a,
          id: a.id || null  // Backend will generate UUID if null
        }))
      };

      const response = await aboutService.updateAboutContent(contentToSave);

      // Update local state with server response (includes generated UUIDs)
      setAboutContent(response);
      toast.success('Content saved successfully! Changes will appear on both About and Home pages.');
    } catch (error) {
      console.error('Error saving content:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error occurred';

      // Check if it's an auth error
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Your session may have expired. Please login again.');
      } else {
        toast.error(`Error saving content: ${errorMessage}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setAboutContent(prev => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field, index, value) => {
    setAboutContent(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field, defaultItem) => {
    setAboutContent(prev => ({
      ...prev,
      [field]: [...prev[field], defaultItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setAboutContent(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateValue = (index, field, value) => {
    setAboutContent(prev => {
      const newValues = [...prev.values];
      newValues[index] = { ...newValues[index], [field]: value };
      return { ...prev, values: newValues };
    });
  };

  const addValue = () => {
    const newValue = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      icon: 'Award',
      title: 'New Value',
      description: 'Description here'
    };
    setAboutContent(prev => ({
      ...prev,
      values: [...prev.values, newValue]
    }));
  };

  const removeValue = (index) => {
    if (window.confirm('Are you sure you want to delete this value?')) {
      setAboutContent(prev => ({
        ...prev,
        values: prev.values.filter((_, i) => i !== index)
      }));
    }
  };

  // Achievement management functions
  const updateAchievement = (index, field, value) => {
    setAboutContent(prev => {
      const newAchievements = [...prev.achievements];
      newAchievements[index] = { ...newAchievements[index], [field]: value };
      return { ...prev, achievements: newAchievements };
    });
  };

  const addAchievement = () => {
    const newAchievement = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      icon: 'Award',
      value: '0+',
      label: 'New Achievement'
    };
    setAboutContent(prev => ({
      ...prev,
      achievements: [...(prev.achievements || []), newAchievement]
    }));
  };

  const removeAchievement = (index) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      setAboutContent(prev => ({
        ...prev,
        achievements: prev.achievements.filter((_, i) => i !== index)
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ padding: '60px', textAlign: 'center' }}>
        <div>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>Loading About content...</p>
        </div>
      </div>
    );
  }

  if (!aboutContent) {
    return (
      <div className="max-w-2xl mx-auto" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#F3F4F6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Award size={40} color="#a34e1d" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#352a21', marginBottom: '12px' }}>
            No About Content Found
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '32px', lineHeight: '1.6' }}>
            Initialize your About page content with default values. You can customize everything after initialization.
          </p>
          <button
            onClick={async () => {
              try {
                setLoading(true);
                const data = await aboutService.initializeAboutContent();
                setAboutContent(data);
                toast.success('About content initialized successfully!');
              } catch (error) {
                console.error('Error initializing:', error);
                toast.error('Failed to initialize content. Please try again.');
              } finally {
                setLoading(false);
              }
            }}
            className="admin-btn admin-btn-primary"
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={20} />
            Initialize About Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header with Gradient Background */}
      <div style={{
        background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
        color: 'white',
        padding: '32px',
        borderRadius: '16px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ flex: '1', minWidth: '280px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em'
          }}>
            📄 About Page Manager
          </h1>
          <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
            Manage all About page content - Hero, Story, Values, Tech Stack, Numbers, Founder
          </p>
        </div>
        <button
          onClick={saveContent}
          disabled={saving}
          className="admin-btn admin-btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '600',
            background: 'white',
            color: '#5b4632',
            border: 'none',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1
          }}
          data-testid="save-about-content-btn"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        background: 'white',
        borderRadius: '12px 12px 0 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        marginBottom: '0'
      }}>
        <div style={{
          display: 'flex',
          gap: '0',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderBottom: '2px solid #E5E7EB'
        }}>
          {['hero', 'story', 'values', 'techstack', 'numbers', 'founder', 'cta'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px 24px',
                background: activeTab === tab ? 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)' : 'white',
                border: 'none',
                borderBottom: activeTab === tab ? 'none' : '2px solid transparent',
                color: activeTab === tab ? 'white' : '#6B7280',
                fontWeight: activeTab === tab ? '600' : '500',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontSize: '15px',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
                position: 'relative'
              }}
              data-testid={`tab-${tab}`}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.background = '#F9FAFB';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.background = 'white';
                }
              }}
            >
              {tab === 'techstack' ? 'Tech Stack' : tab === 'cta' ? 'CTA' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div style={{
        background: 'white',
        padding: '32px',
        borderRadius: '0 0 12px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        minHeight: '400px'
      }}>

        {/* Hero Section */}
        {activeTab === 'hero' && (
          <div>
            <div style={{
              marginBottom: '32px',
              paddingBottom: '20px',
              borderBottom: '2px solid #F3F4F6'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1F2937',
                margin: '0 0 8px 0'
              }}>
                Hero Section
              </h2>
              <p style={{ margin: 0, color: '#6B7280', fontSize: '14px' }}>
                The main banner area that appears at the top of the About page
              </p>
            </div>

            <div style={{ display: 'grid', gap: '24px', maxWidth: '800px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Badge Text
                </label>
                <input
                  type="text"
                  value={aboutContent.hero_badge || ''}
                  onChange={(e) => updateField('hero_badge', e.target.value)}
                  className="admin-input"
                  placeholder="Premium Web Development Agency"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Title
                </label>
                <input
                  type="text"
                  value={aboutContent.hero_title || ''}
                  onChange={(e) => updateField('hero_title', e.target.value)}
                  className="admin-input"
                  placeholder="About METECHQ"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Subtitle
                </label>
                <input
                  type="text"
                  value={aboutContent.hero_subtitle || ''}
                  onChange={(e) => updateField('hero_subtitle', e.target.value)}
                  className="admin-input"
                  placeholder="Crafting Digital Excellence..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Description
                </label>
                <textarea
                  value={aboutContent.hero_description || ''}
                  onChange={(e) => updateField('hero_description', e.target.value)}
                  className="admin-textarea"
                  rows={4}
                  placeholder="Building exceptional digital experiences..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Story Section */}
        {activeTab === 'story' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Story Section</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Story Title</label>
              <input
                type="text"
                value={aboutContent.story_title || ''}
                onChange={(e) => updateField('story_title', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Story Paragraphs</label>
              {aboutContent.story_paragraphs?.map((para, index) => (
                <div key={index} style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                  <textarea
                    value={para}
                    onChange={(e) => updateArrayField('story_paragraphs', index, e.target.value)}
                    className="admin-textarea"
                    rows={3}
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={() => removeArrayItem('story_paragraphs', index)}
                    className="admin-btn admin-btn-danger"
                    style={{ height: 'fit-content' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('story_paragraphs', 'New paragraph...')}
                className="admin-btn admin-btn-secondary"
              >
                <Plus size={18} /> Add Paragraph
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Core Expertise List</label>
              {aboutContent.story_expertise?.map((expertise, index) => (
                <div key={index} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => updateArrayField('story_expertise', index, e.target.value)}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={() => removeArrayItem('story_expertise', index)}
                    className="admin-btn admin-btn-danger"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('story_expertise', 'New Expertise')}
                className="admin-btn admin-btn-secondary"
              >
                <Plus size={18} /> Add Expertise
              </button>
            </div>
          </div>
        )}

        {/* Values Section - Principles That Drive Us */}
        {activeTab === 'values' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Principles That Drive Us</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Section Badge</label>
              <input
                type="text"
                value={aboutContent.values_badge || ''}
                onChange={(e) => updateField('values_badge', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Section Title</label>
              <input
                type="text"
                value={aboutContent.values_title || ''}
                onChange={(e) => updateField('values_title', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Section Description</label>
              <input
                type="text"
                value={aboutContent.values_description || ''}
                onChange={(e) => updateField('values_description', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Values</h3>
              {aboutContent.values?.map((value, index) => {
                const IconComponent = iconMap[value.icon] || Award;
                return (
                  <div key={value.id || `value-${index}`} style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '16px',
                    background: '#F9FAFB'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <IconComponent size={24} color="#a34e1d" />
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{value.title}</h4>
                      </div>
                      <button
                        onClick={() => removeValue(index)}
                        className="admin-btn admin-btn-danger"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Icon</label>
                        <select
                          value={value.icon}
                          onChange={(e) => updateValue(index, 'icon', e.target.value)}
                          className="admin-input"
                        >
                          {iconOptions.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Title</label>
                        <input
                          type="text"
                          value={value.title}
                          onChange={(e) => updateValue(index, 'title', e.target.value)}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Description</label>
                      <textarea
                        value={value.description}
                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                        className="admin-textarea"
                        rows={3}
                      />
                    </div>
                  </div>
                );
              })}
              <button
                onClick={addValue}
                className="admin-btn admin-btn-secondary"
              >
                <Plus size={18} /> Add New Value
              </button>
            </div>
          </div>
        )}

        {/* Tech Stack Section */}
        {activeTab === 'techstack' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Technology Stack</h2>
            <p style={{ color: '#6B7280', marginBottom: '24px' }}>This section displays your core expertise list from the Story section.</p>
            <p style={{ fontStyle: 'italic', color: '#a34e1d' }}>✓ Automatically displays technologies from "Core Expertise" in Story tab</p>
          </div>
        )}

        {/* Numbers That Speak - Achievements */}
        {activeTab === 'numbers' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Numbers That Speak</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Section Badge</label>
              <input
                type="text"
                value={aboutContent.achievements_badge || ''}
                onChange={(e) => updateField('achievements_badge', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Section Title</label>
              <input
                type="text"
                value={aboutContent.achievements_title || ''}
                onChange={(e) => updateField('achievements_title', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Achievements</h3>
              {aboutContent.achievements?.map((achievement, index) => {
                const IconComponent = iconMap[achievement.icon] || Award;
                return (
                  <div key={achievement.id || `achievement-${index}`} style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '16px',
                    background: '#F9FAFB'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <IconComponent size={24} color="#a34e1d" />
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{achievement.value} - {achievement.label}</h4>
                      </div>
                      <button
                        onClick={() => removeAchievement(index)}
                        className="admin-btn admin-btn-danger"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Icon</label>
                        <select
                          value={achievement.icon}
                          onChange={(e) => updateAchievement(index, 'icon', e.target.value)}
                          className="admin-input"
                        >
                          {iconOptions.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Value (e.g., 50+)</label>
                        <input
                          type="text"
                          value={achievement.value}
                          onChange={(e) => updateAchievement(index, 'value', e.target.value)}
                          className="admin-input"
                          placeholder="50+"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Label</label>
                        <input
                          type="text"
                          value={achievement.label}
                          onChange={(e) => updateAchievement(index, 'label', e.target.value)}
                          className="admin-input"
                          placeholder="Projects Completed"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={addAchievement}
                className="admin-btn admin-btn-secondary"
              >
                <Plus size={18} /> Add New Achievement
              </button>
            </div>
          </div>
        )}

        {/* Founder Section - The Mind Behind METECHQ */}
        {activeTab === 'founder' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>The Mind Behind METECHQ</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Section Badge</label>
              <input
                type="text"
                value={aboutContent.founder_badge || ''}
                onChange={(e) => updateField('founder_badge', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Section Title</label>
              <input
                type="text"
                value={aboutContent.founder_title || ''}
                onChange={(e) => updateField('founder_title', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Founder Name</label>
              <input
                type="text"
                value={aboutContent.founder_name || ''}
                onChange={(e) => updateField('founder_name', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Founder Role</label>
              <input
                type="text"
                value={aboutContent.founder_role || ''}
                onChange={(e) => updateField('founder_role', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Founder Bio</label>
              <textarea
                value={aboutContent.founder_bio || ''}
                onChange={(e) => updateField('founder_bio', e.target.value)}
                className="admin-textarea"
                rows={4}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Founder Skills/Specializations</label>
              {aboutContent.founder_skills?.map((skill, index) => (
                <div key={index} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateArrayField('founder_skills', index, e.target.value)}
                    className="admin-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={() => removeArrayItem('founder_skills', index)}
                    className="admin-btn admin-btn-danger"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('founder_skills', 'New Skill')}
                className="admin-btn admin-btn-secondary"
              >
                <Plus size={18} /> Add Skill
              </button>
            </div>

            <div style={{
              padding: '20px',
              background: '#F0FDF4',
              borderRadius: '8px',
              border: '1px solid #86EFAC',
              marginTop: '24px'
            }}>
              <p style={{ margin: 0, color: '#166534', fontWeight: '500' }}>
                ✓ Photo has been removed as requested
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#15803D' }}>
                The founder photo will not be displayed on the About page
              </p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {activeTab === 'cta' && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>Call to Action Section</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>CTA Title</label>
              <input
                type="text"
                value={aboutContent.cta_title || ''}
                onChange={(e) => updateField('cta_title', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>CTA Description</label>
              <textarea
                value={aboutContent.cta_description || ''}
                onChange={(e) => updateField('cta_description', e.target.value)}
                className="admin-textarea"
                rows={3}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Button Text</label>
              <input
                type="text"
                value={aboutContent.cta_button_text || ''}
                onChange={(e) => updateField('cta_button_text', e.target.value)}
                className="admin-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Button Link</label>
              <input
                type="text"
                value={aboutContent.cta_button_link || ''}
                onChange={(e) => updateField('cta_button_link', e.target.value)}
                className="admin-input"
                placeholder="/contact"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button (Bottom) */}
      <div style={{ marginTop: '32px', textAlign: 'right' }}>
        <button
          onClick={saveContent}
          disabled={saving}
          className="admin-btn admin-btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default AboutManager;
