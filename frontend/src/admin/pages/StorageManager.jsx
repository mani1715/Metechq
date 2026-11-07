import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, File, Code, FileText, Save, X, Upload, CheckCircle, Loader, XCircle } from 'lucide-react';
import axios from 'axios';
import { getBackendURL } from '../../lib/utils';

const BACKEND_URL = getBackendURL();

const StorageManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'note',
    tags: [],
    visibleTo: [],
    files: [] // Changed to support multiple files
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
      const response = await axios.get(`${BACKEND_URL}/storage/items`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching storage items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');

    try {
      if (editingItem) {
        await axios.put(
          `${BACKEND_URL}/storage/items/${editingItem.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${BACKEND_URL}/storage/items`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchItems();
      closeModal();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
      await axios.delete(`${BACKEND_URL}/storage/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setSelectedFiles(files);
    setUploadingFiles(true);

    // Initialize progress tracking
    const initialProgress = files.map((file, index) => ({
      id: index,
      name: file.name,
      status: 'uploading',
      progress: 0
    }));
    setUploadProgress(initialProgress);

    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
      const uploadedFiles = [];

      // Upload files one by one with progress tracking
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const formDataUpload = new FormData();
          formDataUpload.append('file', file);

          const response = await axios.post(
            `${BACKEND_URL}/storage/upload`,
            formDataUpload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          uploadedFiles.push({
            url: response.data.url,
            name: response.data.filename
          });

          // Update progress to completed
          setUploadProgress(prev => prev.map((p, idx) =>
            idx === i ? { ...p, status: 'completed', progress: 100 } : p
          ));
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadProgress(prev => prev.map((p, idx) =>
            idx === i ? { ...p, status: 'error', progress: 0 } : p
          ));
        }
      }

      // Update form data with uploaded files
      setFormData({
        ...formData,
        files: uploadedFiles,
        type: 'file',
        title: formData.title || (uploadedFiles.length === 1 ? uploadedFiles[0].name : `${uploadedFiles.length} files`)
      });

    } finally {
      setUploadingFiles(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        content: item.content || '',
        type: item.type,
        tags: item.tags || [],
        visibleTo: item.visibleTo || [],
        files: item.files || (item.fileUrl ? [{ url: item.fileUrl, name: item.fileName }] : [])
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        content: '',
        type: 'note',
        tags: [],
        visibleTo: [],
        files: []
      });
    }
    setSelectedFiles([]);
    setUploadProgress([]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setSelectedFiles([]);
    setUploadProgress([]);
  };

  const removeUploadedFile = (index) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, i) => i !== index)
    });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'code':
        return <Code size={20} />;
      case 'file':
        return <File size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  if (loading) {
    return <div className="admin-page"><p>Loading...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{
        background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
        color: 'white',
        padding: '32px',
        borderRadius: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <h1 data-testid="storage-manager-heading" style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            🗄️ Private Storage
          </h1>
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            margin: 0
          }}>
            Securely manage notes, code snippets, and files
          </p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => openModal()}
          data-testid="add-storage-item-btn"
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
          <Plus size={20} /> Add New Item
        </button>
      </div>

      <div className="admin-toolbar" style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div className="admin-search" style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '16px',
            color: '#5b4632',
            zIndex: 1
          }} />
          <input
            type="text"
            placeholder="🔍 Search by title, content, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="storage-search-input"
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              fontSize: '15px',
              border: '2px solid #E5E7EB',
              borderRadius: '10px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#5b4632';
              e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E5E7EB';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="admin-select"
          data-testid="storage-type-filter"
          style={{
            padding: '14px 40px 14px 16px',
            fontSize: '15px',
            fontWeight: '600',
            border: '2px solid #E5E7EB',
            borderRadius: '10px',
            background: 'white',
            color: '#374151',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '160px'
          }}
        >
          <option value="all">📋 All Types</option>
          <option value="note">📝 Notes</option>
          <option value="code">💻 Code</option>
          <option value="file">📎 Files</option>
        </select>
      </div>

      <div className="admin-grid" data-testid="storage-items-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-icon">
                {getTypeIcon(item.type)}
              </div>
              <div className="admin-card-actions">
                <button
                  className="admin-btn-icon"
                  onClick={() => openModal(item)}
                  data-testid={`edit-storage-${item.id}`}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="admin-btn-icon admin-btn-danger"
                  onClick={() => handleDelete(item.id)}
                  data-testid={`delete-storage-${item.id}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3>{item.title}</h3>
            <p className="admin-card-meta">
              Type: <span className="admin-badge admin-badge-primary">{item.type}</span>
            </p>
            {item.fileName && (
              <p className="admin-card-meta" style={{ marginTop: '8px' }}>
                File: <span style={{ color: '#10B981', fontWeight: '500' }}>{item.fileName}</span>
              </p>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="admin-card-tags">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="admin-badge">{tag}</span>
                ))}
              </div>
            )}
            {item.content && (
              <p className="admin-card-preview">
                {item.content.substring(0, 100)}{item.content.length > 100 ? '...' : ''}
              </p>
            )}
            {item.fileUrl && (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '12px',
                  color: '#a34e1d',
                  fontSize: '14px',
                  textDecoration: 'none'
                }}
              >
                <File size={14} /> View File
              </a>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="admin-empty-state">
          <FileText size={48} />
          <h3>No items found</h3>
          <p>Create your first storage item to get started</p>
        </div>
      )}

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '700px' }}>
            <div className="admin-modal-header" style={{
              background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '12px 12px 0 0',
              marginBottom: '24px'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
                {editingItem ? 'Edit Storage Item' : 'Add New Storage Item'}
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
              {/* Title Field */}
              <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="storage-title"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Title <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="storage-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter a descriptive title"
                  data-testid="storage-title-input"
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

              {/* Type Selection */}
              <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="storage-type"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Storage Type
                </label>
                <select
                  id="storage-type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  data-testid="storage-type-select"
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
                  <option value="note">📝 Note</option>
                  <option value="code">💻 Code Snippet</option>
                  <option value="file">📎 File Storage</option>
                </select>
              </div>

              {/* File Upload Section */}
              {formData.type === 'file' && (
                <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}
                  >
                    Upload Files (Multiple Supported)
                  </label>

                  {/* File Upload Button */}
                  <div style={{
                    border: '2px dashed #D1D5DB',
                    borderRadius: '12px',
                    padding: '32px',
                    textAlign: 'center',
                    background: '#F9FAFB',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#5b4632';
                    e.currentTarget.style.background = '#EEF2FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#D1D5DB';
                    e.currentTarget.style.background = '#F9FAFB';
                  }}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                      disabled={uploadingFiles}
                      data-testid="storage-file-input"
                    />
                    <label
                      htmlFor="file-upload"
                      style={{
                        cursor: uploadingFiles ? 'not-allowed' : 'pointer',
                        display: 'block'
                      }}
                    >
                      <Upload
                        size={40}
                        style={{
                          color: '#5b4632',
                          margin: '0 auto 12px'
                        }}
                      />
                      <p style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '4px'
                      }}>
                        {uploadingFiles ? 'Uploading...' : 'Click to upload or drag and drop'}
                      </p>
                      <p style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        margin: 0
                      }}>
                        PDF, DOC, Images, or any file type (Max 10MB each)
                      </p>
                    </label>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress.length > 0 && (
                    <div style={{ marginTop: '16px', padding: '16px', background: '#F3F4F6', borderRadius: '8px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                        Upload Progress
                      </p>
                      {uploadProgress.map((file, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 0',
                          borderBottom: idx < uploadProgress.length - 1 ? '1px solid #E5E7EB' : 'none'
                        }}>
                          {file.status === 'uploading' && <Loader size={16} className="spin" style={{ color: '#5b4632' }} />}
                          {file.status === 'completed' && <CheckCircle size={16} style={{ color: '#10B981' }} />}
                          {file.status === 'error' && <XCircle size={16} style={{ color: '#EF4444' }} />}
                          <span style={{
                            flex: 1,
                            fontSize: '14px',
                            color: file.status === 'error' ? '#EF4444' : '#374151'
                          }}>
                            {file.name}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: file.status === 'completed' ? '#10B981' : file.status === 'error' ? '#EF4444' : '#5b4632'
                          }}>
                            {file.status === 'completed' ? 'Done' : file.status === 'error' ? 'Failed' : 'Uploading...'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Uploaded Files List */}
                  {formData.files && formData.files.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        Uploaded Files ({formData.files.length})
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {formData.files.map((file, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: '#ECFDF5',
                            border: '1px solid #A7F3D0',
                            borderRadius: '8px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <CheckCircle size={18} style={{ color: '#10B981' }} />
                              <span style={{ fontSize: '14px', color: '#065F46', fontWeight: '500' }}>
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeUploadedFile(idx)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                color: '#EF4444'
                              }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Content Field */}
              <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="storage-content"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Content {formData.type === 'note' && <span style={{ fontSize: '12px', fontWeight: '400', color: '#6B7280' }}>(Optional notes or description)</span>}
                </label>
                <textarea
                  id="storage-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  placeholder={formData.type === 'code' ? '// Enter your code here...' : 'Enter content, notes, or description...'}
                  data-testid="storage-content-textarea"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: formData.type === 'code' ? '13px' : '15px',
                    fontFamily: formData.type === 'code' ? 'monospace' : 'inherit',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#5b4632'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Tags Field */}
              <div className="admin-form-group" style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="storage-tags"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Tags <span style={{ fontSize: '12px', fontWeight: '400', color: '#6B7280' }}>(Comma-separated)</span>
                </label>
                <input
                  id="storage-tags"
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  placeholder="e.g., api, secrets, important, documentation"
                  data-testid="storage-tags-input"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#5b4632'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
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
                  data-testid="storage-save-btn"
                  disabled={uploadingFiles}
                  style={{
                    padding: '12px 32px',
                    fontSize: '15px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    background: uploadingFiles ? '#9CA3AF' : 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
                    color: 'white',
                    cursor: uploadingFiles ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Save size={16} /> {editingItem ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageManager;
