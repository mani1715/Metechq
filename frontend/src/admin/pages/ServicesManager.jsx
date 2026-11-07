import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, GripVertical } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const ServicesManager = () => {
  const { adminData, addService, updateService, deleteService } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    icon: 'Code',
    title: '',
    description: '',
    features: [],
    price: '',
    order: 1,
    active: true
  });

  const iconOptions = [
    'Code', 'ShoppingCart', 'Layers', 'Palette', 'Smartphone',
    'Database', 'Cloud', 'Settings', 'Zap', 'Globe'
  ];

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData(service);
    } else {
      setEditingService(null);
      setFormData({
        icon: 'Code',
        title: '',
        description: '',
        features: [],
        price: '',
        order: adminData.services.length + 1,
        active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeaturesChange = (value) => {
    const featuresArray = value.split(',').map(f => f.trim()).filter(f => f);
    setFormData(prev => ({ ...prev, features: featuresArray }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingService) {
      updateService(editingService.id, formData);
    } else {
      addService(formData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
    }
  };

  const handleToggleActive = (service) => {
    updateService(service.id, { ...service, active: !service.active });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#352a21', margin: '0 0 8px 0' }}>
            Services Manager
          </h1>
          <p style={{ color: '#6B7280', margin: 0 }}>
            Manage your service offerings - {adminData.services.length} services
          </p>
        </div>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary">
          <Plus size={18} />
          Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {adminData.services.map((service) => (
          <div
            key={service.id}
            className="admin-stat-card"
            style={{
              opacity: service.active ? 1 : 0.5,
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => handleOpenModal(service)}
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div className="admin-stat-icon purple" style={{ marginBottom: '16px' }}>
                {service.icon}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#352a21',
                margin: '0 0 8px 0'
              }}>
                {service.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: '0 0 16px 0',
                lineHeight: '1.6'
              }}>
                {service.description}
              </p>
            </div>

            {service.features && service.features.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                {service.features.map((feature, idx) => (
                  <div key={idx} style={{
                    fontSize: '13px',
                    color: '#6B7280',
                    padding: '4px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#a34e1d' }}>✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            )}

            <div style={{
              paddingTop: '16px',
              borderTop: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#a34e1d'
              }}>
                {service.price}
              </div>
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={service.active}
                  onChange={() => handleToggleActive(service)}
                />
                <span className="admin-toggle-slider"></span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={handleCloseModal} className="admin-modal-close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Service Title *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Icon</label>
                  <select
                    className="admin-form-select"
                    value={formData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description *</label>
                  <textarea
                    className="admin-form-textarea"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Features (comma-separated)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={formData.features.join(', ')}
                    onChange={(e) => handleFeaturesChange(e.target.value)}
                    placeholder="Feature 1, Feature 2, Feature 3"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Price</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Starting at $2,999"
                  />
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => handleInputChange('active', e.target.checked)}
                    />
                    <span>Active Service</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" onClick={handleCloseModal} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
