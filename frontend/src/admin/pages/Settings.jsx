import React, { useState } from 'react';
import { Save, RotateCcw, Building2, Share2, Palette } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Settings = () => {
  const { adminData, updateSettings, resetToDefaults } = useAdmin();
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('agency');

  const [agencyData, setAgencyData] = useState(adminData?.settings?.agency || {});
  const [socialData, setSocialData] = useState(adminData?.settings?.social || {});
  const [themeData, setThemeData] = useState(adminData?.settings?.theme || {});

  const handleSave = () => {
    updateSettings('agency', agencyData);
    updateSettings('social', socialData);
    updateSettings('theme', themeData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('This will reset ALL data to defaults. Are you sure?')) {
      resetToDefaults();
      setAgencyData(adminData?.settings?.agency || {});
      setSocialData(adminData?.settings?.social || {});
      setThemeData(adminData?.settings?.theme || {});
    }
  };

  const tabs = [
    { id: 'agency', label: 'Agency Info', icon: Building2 },
    { id: 'social', label: 'Social Links', icon: Share2 },
    { id: 'theme', label: 'Theme', icon: Palette }
  ];

  return (
    <div>
      {/* Success Message */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '32px',
          background: '#10B981',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Save size={20} />
          Settings saved successfully!
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#352a21', margin: '0 0 8px 0' }}>
            Settings
          </h1>
          <p style={{ color: '#6B7280', margin: 0 }}>
            Configure your website settings and preferences
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleReset} className="admin-btn admin-btn-secondary">
            <RotateCcw size={18} />
            Reset All
          </button>
          <button onClick={handleSave} className="admin-btn admin-btn-primary">
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        borderBottom: '2px solid #E5E7EB',
        paddingBottom: '0'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #a34e1d' : '2px solid transparent',
              color: activeTab === tab.id ? '#a34e1d' : '#6B7280',
              fontWeight: activeTab === tab.id ? '600' : '400',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Agency Info Tab */}
      {activeTab === 'agency' && (
        <div className="admin-table">
          <div className="admin-table-header">
            <h3 className="admin-table-title">Agency Information</h3>
          </div>
          <div style={{ padding: '24px' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Agency Name</label>
              <input
                type="text"
                className="admin-form-input"
                value={agencyData.name}
                onChange={(e) => setAgencyData({ ...agencyData, name: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Owner Name</label>
              <input
                type="text"
                className="admin-form-input"
                value={agencyData.owner}
                onChange={(e) => setAgencyData({ ...agencyData, owner: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Email Address</label>
              <input
                type="email"
                className="admin-form-input"
                value={agencyData.email}
                onChange={(e) => setAgencyData({ ...agencyData, email: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Phone Number</label>
              <input
                type="tel"
                className="admin-form-input"
                value={agencyData.phone}
                onChange={(e) => setAgencyData({ ...agencyData, phone: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Address</label>
              <input
                type="text"
                className="admin-form-input"
                value={agencyData.address}
                onChange={(e) => setAgencyData({ ...agencyData, address: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Description</label>
              <textarea
                className="admin-form-textarea"
                value={agencyData.description}
                onChange={(e) => setAgencyData({ ...agencyData, description: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Tagline</label>
              <input
                type="text"
                className="admin-form-input"
                value={agencyData.tagline}
                onChange={(e) => setAgencyData({ ...agencyData, tagline: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === 'social' && (
        <div className="admin-table">
          <div className="admin-table-header">
            <h3 className="admin-table-title">Social Media Links</h3>
          </div>
          <div style={{ padding: '24px' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Facebook URL</label>
              <input
                type="url"
                className="admin-form-input"
                value={socialData.facebook}
                onChange={(e) => setSocialData({ ...socialData, facebook: e.target.value })}
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Twitter URL</label>
              <input
                type="url"
                className="admin-form-input"
                value={socialData.twitter}
                onChange={(e) => setSocialData({ ...socialData, twitter: e.target.value })}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">LinkedIn URL</label>
              <input
                type="url"
                className="admin-form-input"
                value={socialData.linkedin}
                onChange={(e) => setSocialData({ ...socialData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Instagram URL</label>
              <input
                type="url"
                className="admin-form-input"
                value={socialData.instagram}
                onChange={(e) => setSocialData({ ...socialData, instagram: e.target.value })}
                placeholder="https://instagram.com/yourhandle"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">GitHub URL</label>
              <input
                type="url"
                className="admin-form-input"
                value={socialData.github}
                onChange={(e) => setSocialData({ ...socialData, github: e.target.value })}
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div style={{
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '2px solid #E5E7EB'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#352a21',
                marginBottom: '16px'
              }}>
                WhatsApp Integration
              </h4>

              <div className="admin-form-group">
                <label className="admin-form-label">WhatsApp Number (Indian Number)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '10px 16px',
                    background: '#F3F4F6',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    +91
                  </span>
                  <input
                    type="tel"
                    className="admin-form-input"
                    value={socialData.whatsapp_number ? socialData.whatsapp_number.replace('+91', '') : ''}
                    onChange={(e) => {
                      const number = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setSocialData({ ...socialData, whatsapp_number: number ? `+91${number}` : '' });
                    }}
                    placeholder="9876543210"
                    maxLength="10"
                    style={{ flex: 1 }}
                  />
                </div>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  marginTop: '6px'
                }}>
                  Enter 10-digit Indian mobile number (e.g., 9876543210). Country code +91 will be added automatically.
                </p>
              </div>
            </div>

            <div style={{
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '2px solid #E5E7EB'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#352a21',
                marginBottom: '16px'
              }}>
                Social Sharing Options
              </h4>

              <div className="admin-form-group">
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '12px',
                  background: 'rgba(163, 78, 29, 0.05)',
                  border: '1px solid rgba(163, 78, 29, 0.2)',
                  borderRadius: '8px'
                }}>
                  <input
                    type="checkbox"
                    checked={socialData.enable_share_buttons !== false}
                    onChange={(e) => setSocialData({ ...socialData, enable_share_buttons: e.target.checked })}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#352a21',
                      marginBottom: '4px'
                    }}>
                      Enable Social Share Buttons
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#6B7280'
                    }}>
                      Display share buttons (LinkedIn, Twitter, WhatsApp, Email) on blog posts and portfolio projects
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Tab */}
      {activeTab === 'theme' && (
        <div className="admin-table">
          <div className="admin-table-header">
            <h3 className="admin-table-title">Theme Colors</h3>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{
              background: 'rgba(163, 78, 29, 0.05)',
              border: '1px solid rgba(163, 78, 29, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#6B7280'
            }}>
              🚧 Theme customization coming soon. These settings will allow you to customize colors across the entire website.
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Primary Color</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={themeData.primaryColor}
                  onChange={(e) => setThemeData({ ...themeData, primaryColor: e.target.value })}
                  style={{ width: '60px', height: '45px', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <input
                  type="text"
                  className="admin-form-input"
                  value={themeData.primaryColor}
                  onChange={(e) => setThemeData({ ...themeData, primaryColor: e.target.value })}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Secondary Color (Gold)</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={themeData.secondaryColor}
                  onChange={(e) => setThemeData({ ...themeData, secondaryColor: e.target.value })}
                  style={{ width: '60px', height: '45px', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <input
                  type="text"
                  className="admin-form-input"
                  value={themeData.secondaryColor}
                  onChange={(e) => setThemeData({ ...themeData, secondaryColor: e.target.value })}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Dark Color (Navy)</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={themeData.darkColor}
                  onChange={(e) => setThemeData({ ...themeData, darkColor: e.target.value })}
                  style={{ width: '60px', height: '45px', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                />
                <input
                  type="text"
                  className="admin-form-input"
                  value={themeData.darkColor}
                  onChange={(e) => setThemeData({ ...themeData, darkColor: e.target.value })}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
