import React, { useState } from 'react';
import { Save, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const PageEditor = () => {
  const { adminData, updatePageContent } = useAdmin();
  const [selectedPage, setSelectedPage] = useState('home');
  const [showSuccess, setShowSuccess] = useState(false);
  const [editData, setEditData] = useState(adminData.pagesContent[selectedPage]);

  const pages = [
    { id: 'home', name: 'Home Page' },
    { id: 'about', name: 'About Page' },
    { id: 'services', name: 'Services Page' },
    { id: 'portfolio', name: 'Portfolio Page' },
    { id: 'contact', name: 'Contact Page' }
  ];

  const handlePageChange = (pageId) => {
    setSelectedPage(pageId);
    setEditData(adminData.pagesContent[pageId]);
  };

  const handleSectionUpdate = (section, field, value) => {
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    Object.keys(editData).forEach(section => {
      updatePageContent(selectedPage, section, editData[section]);
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    setEditData(adminData.pagesContent[selectedPage]);
  };

  const renderHomeEditor = () => (
    <>
      {/* Hero Section */}
      <div className="admin-table" style={{ marginBottom: '24px' }}>
        <div className="admin-table-header">
          <h3 className="admin-table-title">Hero Section</h3>
          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={editData.hero?.visible}
              onChange={(e) => handleSectionUpdate('hero', 'visible', e.target.checked)}
            />
            <span className="admin-toggle-slider"></span>
          </label>
        </div>
        <div style={{ padding: '24px' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Badge Text</label>
            <input
              type="text"
              className="admin-form-input"
              value={editData.hero?.badge || ''}
              onChange={(e) => handleSectionUpdate('hero', 'badge', e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Headline</label>
            <input
              type="text"
              className="admin-form-input"
              value={editData.hero?.headline || ''}
              onChange={(e) => handleSectionUpdate('hero', 'headline', e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Subheadline</label>
            <input
              type="text"
              className="admin-form-input"
              value={editData.hero?.subheadline || ''}
              onChange={(e) => handleSectionUpdate('hero', 'subheadline', e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea
              className="admin-form-textarea"
              value={editData.hero?.description || ''}
              onChange={(e) => handleSectionUpdate('hero', 'description', e.target.value)}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">CTA 1 Text</label>
              <input
                type="text"
                className="admin-form-input"
                value={editData.hero?.cta1Text || ''}
                onChange={(e) => handleSectionUpdate('hero', 'cta1Text', e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">CTA 1 Link</label>
              <input
                type="text"
                className="admin-form-input"
                value={editData.hero?.cta1Link || ''}
                onChange={(e) => handleSectionUpdate('hero', 'cta1Link', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="admin-table" style={{ marginBottom: '24px' }}>
        <div className="admin-table-header">
          <h3 className="admin-table-title">Stats Section</h3>
          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={editData.stats?.visible}
              onChange={(e) => handleSectionUpdate('stats', 'visible', e.target.checked)}
            />
            <span className="admin-toggle-slider"></span>
          </label>
        </div>
        <div style={{ padding: '24px', color: '#6B7280' }}>
          Stats items can be edited from the Dashboard settings.
        </div>
      </div>
    </>
  );

  const renderAboutEditor = () => (
    <>
      <div className="admin-table" style={{ marginBottom: '24px' }}>
        <div className="admin-table-header">
          <h3 className="admin-table-title">Hero Section</h3>
          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={editData.hero?.visible}
              onChange={(e) => handleSectionUpdate('hero', 'visible', e.target.checked)}
            />
            <span className="admin-toggle-slider"></span>
          </label>
        </div>
        <div style={{ padding: '24px' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Headline</label>
            <input
              type="text"
              className="admin-form-input"
              value={editData.hero?.headline || ''}
              onChange={(e) => handleSectionUpdate('hero', 'headline', e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Subheadline</label>
            <input
              type="text"
              className="admin-form-input"
              value={editData.hero?.subheadline || ''}
              onChange={(e) => handleSectionUpdate('hero', 'subheadline', e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea
              className="admin-form-textarea"
              value={editData.hero?.description || ''}
              onChange={(e) => handleSectionUpdate('hero', 'description', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="admin-table" style={{ marginBottom: '24px' }}>
        <div className="admin-table-header">
          <h3 className="admin-table-title">Mission</h3>
          <label className="admin-toggle">
            <input
              type="checkbox"
              checked={editData.mission?.visible}
              onChange={(e) => handleSectionUpdate('mission', 'visible', e.target.checked)}
            />
            <span className="admin-toggle-slider"></span>
          </label>
        </div>
        <div style={{ padding: '24px' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Headline</label>
            <input
              type="text"
              className="admin-form-input"
              value={editData.mission?.headline || ''}
              onChange={(e) => handleSectionUpdate('mission', 'headline', e.target.value)}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea
              className="admin-form-textarea"
              value={editData.mission?.description || ''}
              onChange={(e) => handleSectionUpdate('mission', 'description', e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderGenericEditor = () => (
    <div className="admin-table">
      <div className="admin-table-header">
        <h3 className="admin-table-title">Hero Section</h3>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={editData.hero?.visible}
            onChange={(e) => handleSectionUpdate('hero', 'visible', e.target.checked)}
          />
          <span className="admin-toggle-slider"></span>
        </label>
      </div>
      <div style={{ padding: '24px' }}>
        <div className="admin-form-group">
          <label className="admin-form-label">Headline</label>
          <input
            type="text"
            className="admin-form-input"
            value={editData.hero?.headline || ''}
            onChange={(e) => handleSectionUpdate('hero', 'headline', e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Description</label>
          <textarea
            className="admin-form-textarea"
            value={editData.hero?.description || ''}
            onChange={(e) => handleSectionUpdate('hero', 'description', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

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
          Changes saved successfully!
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#352a21', margin: '0 0 8px 0' }}>
            Page Editor
          </h1>
          <p style={{ color: '#6B7280', margin: 0 }}>
            Edit content for all website pages
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleReset} className="admin-btn admin-btn-secondary">
            <RotateCcw size={18} />
            Reset
          </button>
          <button onClick={handleSave} className="admin-btn admin-btn-primary">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        borderBottom: '2px solid #E5E7EB',
        paddingBottom: '0'
      }}>
        {pages.map(page => (
          <button
            key={page.id}
            onClick={() => handlePageChange(page.id)}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: selectedPage === page.id ? '2px solid #a34e1d' : '2px solid transparent',
              color: selectedPage === page.id ? '#a34e1d' : '#6B7280',
              fontWeight: selectedPage === page.id ? '600' : '400',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            {page.name}
          </button>
        ))}
      </div>

      {/* Editor Content */}
      {selectedPage === 'home' && renderHomeEditor()}
      {selectedPage === 'about' && renderAboutEditor()}
      {(selectedPage === 'services' || selectedPage === 'portfolio' || selectedPage === 'contact') && renderGenericEditor()}
    </div>
  );
};

export default PageEditor;
