import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Shield, User, Key, UserCog } from 'lucide-react';
import axios from 'axios';
import { getBackendURL } from '../../lib/utils';

const BACKEND_URL = getBackendURL();

const AdminsManager = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin',
    permissions: {
      // Admin Management
      canManageAdmins: false,
      // Content Management
      canManageAbout: true,
      canManagePortfolio: true,
      canManageBlogs: true,
      canManageTestimonials: true,
      canManageDemos: true,
      // Communication
      canViewContacts: true,
      canManageContactPage: true,
      canManageChat: true,
      canManageNewsletter: true,
      // Business Features
      canManageBookings: true,
      canManageBookingSettings: false,
      canManagePricing: true,
      canViewAnalytics: true,
      // Client Management
      canManageClients: true,
      canManageClientProjects: true,
      // System
      canAccessStorage: false,
      canManageNotes: true,
      canManageSettings: false,
      // Legacy
      canViewPrivateProjects: true
    }
  });

  // Permission Presets
  const permissionPresets = {
    super_admin: {
      canManageAdmins: true,
      canManageAbout: true,
      canManagePortfolio: true,
      canManageBlogs: true,
      canManageTestimonials: true,
      canManageDemos: true,
      canViewContacts: true,
      canManageContactPage: true,
      canManageChat: true,
      canManageNewsletter: true,
      canManageBookings: true,
      canManageBookingSettings: true,
      canManagePricing: true,
      canViewAnalytics: true,
      canManageClients: true,
      canManageClientProjects: true,
      canAccessStorage: true,
      canManageNotes: true,
      canManageSettings: true,
      canViewPrivateProjects: true
    },
    editor: {
      canManageAdmins: false,
      canManageAbout: true,
      canManagePortfolio: true,
      canManageBlogs: true,
      canManageTestimonials: true,
      canManageDemos: true,
      canViewContacts: false,
      canManageContactPage: true,
      canManageChat: false,
      canManageNewsletter: true,
      canManageBookings: false,
      canManageBookingSettings: false,
      canManagePricing: false,
      canViewAnalytics: false,
      canManageClients: false,
      canManageClientProjects: false,
      canAccessStorage: false,
      canManageNotes: true,
      canManageSettings: false,
      canViewPrivateProjects: false
    },
    moderator: {
      canManageAdmins: false,
      canManageAbout: false,
      canManagePortfolio: false,
      canManageBlogs: true,
      canManageTestimonials: true,
      canManageDemos: false,
      canViewContacts: true,
      canManageContactPage: false,
      canManageChat: true,
      canManageNewsletter: true,
      canManageBookings: false,
      canManageBookingSettings: false,
      canManagePricing: false,
      canViewAnalytics: false,
      canManageClients: false,
      canManageClientProjects: false,
      canAccessStorage: false,
      canManageNotes: true,
      canManageSettings: false,
      canViewPrivateProjects: false
    },
    viewer: {
      canManageAdmins: false,
      canManageAbout: false,
      canManagePortfolio: false,
      canManageBlogs: false,
      canManageTestimonials: false,
      canManageDemos: false,
      canViewContacts: true,
      canManageContactPage: false,
      canManageChat: false,
      canManageNewsletter: false,
      canManageBookings: false,
      canManageBookingSettings: false,
      canManagePricing: false,
      canViewAnalytics: true,
      canManageClients: false,
      canManageClientProjects: false,
      canAccessStorage: false,
      canManageNotes: false,
      canManageSettings: false,
      canViewPrivateProjects: false
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchAdmins();
  }, []);

  const fetchCurrentUser = () => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
      const response = await axios.get(`${BACKEND_URL}/admins/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(response.data.admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      if (error.response?.status === 403) {
        alert('You do not have permission to manage admins');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');

    try {
      if (editingAdmin) {
        const updateData = {
          username: formData.username,
          permissions: formData.permissions
        };
        if (formData.password) {
          updateData.password = formData.password;
        }

        await axios.put(
          `${BACKEND_URL}/admins/${editingAdmin.id}`,
          updateData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${BACKEND_URL}/admins/create`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchAdmins();
      closeModal();
    } catch (error) {
      console.error('Error saving admin:', error);
      alert(error.response?.data?.detail || 'Failed to save admin');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
      await axios.delete(`${BACKEND_URL}/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert(error.response?.data?.detail || 'Failed to delete admin');
    }
  };

  const openModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setSelectedPreset('custom');
      setFormData({
        username: admin.username,
        password: '',
        role: admin.role,
        permissions: admin.permissions || {
          canManageAdmins: false,
          canManageAbout: true,
          canManagePortfolio: true,
          canManageBlogs: true,
          canManageTestimonials: true,
          canManageDemos: true,
          canViewContacts: true,
          canManageContactPage: true,
          canManageChat: true,
          canManageNewsletter: true,
          canManageBookings: true,
          canManageBookingSettings: false,
          canManagePricing: true,
          canViewAnalytics: true,
          canManageClients: true,
          canManageClientProjects: true,
          canAccessStorage: false,
          canManageNotes: true,
          canManageSettings: false,
          canViewPrivateProjects: true
        }
      });
    } else {
      setEditingAdmin(null);
      setSelectedPreset('custom');
      setFormData({
        username: '',
        password: '',
        role: 'admin',
        permissions: {
          canManageAdmins: false,
          canManageAbout: true,
          canManagePortfolio: true,
          canManageBlogs: true,
          canManageTestimonials: true,
          canManageDemos: true,
          canViewContacts: true,
          canManageContactPage: true,
          canManageChat: true,
          canManageNewsletter: true,
          canManageBookings: true,
          canManageBookingSettings: false,
          canManagePricing: true,
          canViewAnalytics: true,
          canManageClients: true,
          canManageClientProjects: true,
          canAccessStorage: false,
          canManageNotes: true,
          canManageSettings: false,
          canViewPrivateProjects: true
        }
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAdmin(null);
  };

  const togglePermission = (key) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [key]: !formData.permissions[key]
      }
    });
    setSelectedPreset('custom');
  };

  const applyPreset = (presetName) => {
    setSelectedPreset(presetName);
    if (presetName === 'custom') return;

    setFormData({
      ...formData,
      permissions: { ...permissionPresets[presetName] }
    });
  };

  const selectAllPermissions = () => {
    const allTrue = {};
    Object.keys(formData.permissions).forEach(key => {
      allTrue[key] = true;
    });
    setFormData({
      ...formData,
      permissions: allTrue
    });
    setSelectedPreset('custom');
  };

  const deselectAllPermissions = () => {
    const allFalse = {};
    Object.keys(formData.permissions).forEach(key => {
      allFalse[key] = false;
    });
    setFormData({
      ...formData,
      permissions: allFalse
    });
    setSelectedPreset('custom');
  };

  if (loading) {
    return <div className="admin-page"><p>Loading...</p></div>;
  }

  const isSuperAdmin = currentUser?.role === 'super_admin';

  if (!isSuperAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-empty-state">
          <Shield size={48} />
          <h3>Access Denied</h3>
          <p>Only super admins can manage admin accounts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header with Gradient Background */}
      <div className="admin-page-header" style={{
        background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
        color: 'white',
        padding: '32px',
        borderRadius: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <h1 data-testid="admins-manager-heading" style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            👥 Admin Management
          </h1>
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            margin: 0
          }}>
            Manage admin users and their permissions
          </p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => openModal()}
          data-testid="add-admin-btn"
          style={{
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '600',
            background: 'white',
            color: '#5b4632',
            border: 'none',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          <Plus size={20} /> Add Admin
        </button>
      </div>

      {/* Table Container */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <table className="admin-table" data-testid="admins-table" style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
              color: 'white'
            }}>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}>Username</th>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}>Role</th>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}>Permissions</th>
              <th style={{
                padding: '16px 20px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}>Created</th>
              <th style={{
                padding: '16px 20px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={admin.id} style={{
                borderBottom: index < admins.length - 1 ? '1px solid #E5E7EB' : 'none',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {admin.role === 'super_admin' ?
                      <Shield size={18} style={{ color: '#10B981' }} /> :
                      <User size={18} style={{ color: '#5b4632' }} />
                    }
                    <span style={{ fontWeight: '500', fontSize: '15px', color: '#111827' }}>
                      {admin.username}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    background: admin.role === 'super_admin' ? '#D1FAE5' : '#DBEAFE',
                    color: admin.role === 'super_admin' ? '#065F46' : '#1E40AF'
                  }}>
                    {admin.role === 'super_admin' ? 'super_admin' : 'admin'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {admin.permissions?.canManageAdmins && (
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: '#FEF3C7',
                        color: '#92400E'
                      }}>Manage Admins</span>
                    )}
                    {admin.permissions?.canViewPrivateProjects && (
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: '#E0E7FF',
                        color: '#3730A3'
                      }}>View Projects</span>
                    )}
                    {admin.permissions?.canAccessStorage && (
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: '#D1FAE5',
                        color: '#065F46'
                      }}>Access Storage</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6B7280' }}>
                  {new Date(admin.created_at).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                  })}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {admin.role !== 'super_admin' && (
                      <>
                        <button
                          onClick={() => openModal(admin)}
                          data-testid={`edit-admin-${admin.id}`}
                          style={{
                            padding: '8px',
                            background: '#EEF2FF',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#5b4632',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#5b4632';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#EEF2FF';
                            e.currentTarget.style.color = '#5b4632';
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          data-testid={`delete-admin-${admin.id}`}
                          style={{
                            padding: '8px',
                            background: '#FEE2E2',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#DC2626',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#DC2626';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#FEE2E2';
                            e.currentTarget.style.color = '#DC2626';
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {admins.length === 0 && (
        <div className="admin-empty-state">
          <UserCog size={48} />
          <h3>No admins yet</h3>
          <p>Create your first admin account to get started</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header" style={{
              background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '12px 12px 0 0',
              marginBottom: '24px'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
                {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
              </h2>
              <button
                className="admin-btn-icon"
                onClick={closeModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px' }}>
              {/* Username Field */}
              <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="admin-username"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Username <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="admin-username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  placeholder="Enter username"
                  data-testid="admin-username-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#5b4632'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Password Field */}
              <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="admin-password"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Password {editingAdmin ?
                    <span style={{ fontSize: '12px', fontWeight: '400', color: '#6B7280' }}>(leave empty to keep current)</span> :
                    <span style={{ color: '#EF4444' }}>*</span>
                  }
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingAdmin}
                  placeholder={editingAdmin ? 'Enter new password (optional)' : 'Enter password'}
                  data-testid="admin-password-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#5b4632'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Role Selection */}
              <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="admin-role"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Role
                </label>
                <select
                  id="admin-role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  data-testid="admin-role-select"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {/* Permission Preset Selection */}
              <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="permission-preset"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Permission Preset
                </label>
                <select
                  id="permission-preset"
                  value={selectedPreset}
                  onChange={(e) => applyPreset(e.target.value)}
                  data-testid="permission-preset-select"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="custom">🎯 Custom (Select individually)</option>
                  <option value="super_admin">👑 Super Admin (All permissions)</option>
                  <option value="editor">✍️ Editor (Content management)</option>
                  <option value="moderator">🛡️ Moderator (Communication & moderation)</option>
                  <option value="viewer">👁️ Viewer (Read-only access)</option>
                </select>
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px', marginBottom: 0 }}>
                  Quick presets to assign common permission sets
                </p>
              </div>

              {/* Permissions */}
              <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Permissions
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={selectAllPermissions}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        background: 'white',
                        color: '#374151',
                        cursor: 'pointer'
                      }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={deselectAllPermissions}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        background: 'white',
                        color: '#374151',
                        cursor: 'pointer'
                      }}
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Admin Management */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Management</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageAdmins} onChange={() => togglePermission('canManageAdmins')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Admins</span>
                    </label>
                  </div>
                </div>

                {/* Content Management */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Content Management</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageAbout} onChange={() => togglePermission('canManageAbout')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage About Page</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManagePortfolio} onChange={() => togglePermission('canManagePortfolio')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Portfolio Projects</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageBlogs} onChange={() => togglePermission('canManageBlogs')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Blogs & Articles</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageTestimonials} onChange={() => togglePermission('canManageTestimonials')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Testimonials & Reviews</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageDemos} onChange={() => togglePermission('canManageDemos')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Demo Showcases</span>
                    </label>
                  </div>
                </div>

                {/* Communication */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Communication & Contacts</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canViewContacts} onChange={() => togglePermission('canViewContacts')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>View Contact Submissions</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageContactPage} onChange={() => togglePermission('canManageContactPage')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Contact Page Content</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageChat} onChange={() => togglePermission('canManageChat')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Live Chat & Messages</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageNewsletter} onChange={() => togglePermission('canManageNewsletter')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Newsletter Subscribers</span>
                    </label>
                  </div>
                </div>

                {/* Business Features */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business & Analytics</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageBookings} onChange={() => togglePermission('canManageBookings')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Client Bookings</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageBookingSettings} onChange={() => togglePermission('canManageBookingSettings')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Booking Settings & Availability</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManagePricing} onChange={() => togglePermission('canManagePricing')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Pricing Calculator</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canViewAnalytics} onChange={() => togglePermission('canViewAnalytics')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>View Analytics & Reports</span>
                    </label>
                  </div>
                </div>

                {/* Client Management */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client Portal Management</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageClients} onChange={() => togglePermission('canManageClients')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Client Accounts</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageClientProjects} onChange={() => togglePermission('canManageClientProjects')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Client Projects, Tasks & Milestones</span>
                    </label>
                  </div>
                </div>

                {/* System */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>System & Settings</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canAccessStorage} onChange={() => togglePermission('canAccessStorage')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Access Storage & File Manager</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageNotes} onChange={() => togglePermission('canManageNotes')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage Internal Notes</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                      <input type="checkbox" checked={formData.permissions.canManageSettings} onChange={() => togglePermission('canManageSettings')} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      <span>Manage System Settings</span>
                    </label>
                  </div>
                </div>

                <div style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  background: '#EFF6FF',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#1E40AF',
                  border: '1px solid #DBEAFE'
                }}>
                  <strong>💡 Note:</strong> Super Admin role automatically grants all permissions. Regular admins will only see sections they have permission to access.
                </div>
              </div>

              {/* Modal Footer */}
              <div className="admin-modal-footer" style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                paddingTop: '20px',
                borderTop: '2px solid #F3F4F6'
              }}>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={closeModal}
                  style={{
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  data-testid="admin-save-btn"
                  style={{
                    padding: '12px 32px',
                    fontSize: '15px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Save size={16} /> {editingAdmin ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminsManager;
