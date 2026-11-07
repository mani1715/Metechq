import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, X, ExternalLink, Monitor, Code, FileText, Eye
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const DemoManager = () => {
  const { adminData, fetchProjects, updateProject, deleteProject, addProject } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingDemo, setEditingDemo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Demo',
    description: '',
    image_url: '',
    tech_stack: [],
    demo_link_type: 'internal', // 'internal' or 'external'
    live_demo_url: '',
    case_study_content: '',
    featured: true,
    is_private: false,
    status: 'completed'
  });

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter only demo projects (those with live_demo_url starting with /demo/)
  const demoProjects = adminData.projects.filter(
    project => project.live_demo_url && project.live_demo_url.startsWith('/demo/')
  );

  const handleOpenModal = (demo = null) => {
    if (demo) {
      setEditingDemo(demo);
      const demoUrl = demo.live_demo_url || demo.liveUrl || '';
      const isExternal = demoUrl.startsWith('http://') || demoUrl.startsWith('https://');
      setFormData({
        title: demo.title || '',
        slug: demo.slug || '',
        category: demo.category || 'Demo',
        description: demo.description || '',
        image_url: demo.image_url || demo.image || '',
        tech_stack: demo.tech_stack || demo.techStack || [],
        demo_link_type: isExternal ? 'external' : 'internal',
        live_demo_url: demoUrl,
        case_study_content: demo.case_study_content || '',
        featured: demo.featured || true,
        is_private: demo.is_private || false,
        status: demo.status || 'completed'
      });
    } else {
      setEditingDemo(null);
      setFormData({
        title: '',
        slug: '',
        category: 'Demo',
        description: '',
        image_url: '',
        tech_stack: [],
        demo_link_type: 'internal',
        live_demo_url: '/demo/',
        case_study_content: '',
        featured: true,
        is_private: false,
        status: 'completed'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDemo(null);
    setShowPreview(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Auto-hide preview when URL changes
    if (field === 'live_demo_url') {
      setShowPreview(false);
    }
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const projectData = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      category: formData.category,
      description: formData.description,
      image_url: formData.image_url,
      tech_stack: formData.tech_stack,
      live_demo_url: formData.live_demo_url,
      case_study_content: formData.case_study_content,
      featured: formData.featured,
      is_private: formData.is_private,
      status: formData.status
    };

    if (editingDemo) {
      updateProject(editingDemo.id, projectData);
    } else {
      addProject(projectData);
    }

    handleCloseModal();
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete the demo "${title}"? This action cannot be undone.`)) {
      deleteProject(id);
    }
  };

  // Filter demos based on search
  const filteredDemos = demoProjects.filter(demo =>
    demo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demo.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header with Storage Manager Style */}
      <div style={{
        background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
        color: 'white',
        padding: '32px',
        borderRadius: '16px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            🎨 Demo Manager
          </h1>
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            margin: 0
          }}>
            Manage your demo showcases - {filteredDemos.length} demos
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          data-testid="add-demo-button"
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
          <Plus size={20} />
          Add New Demo
        </button>
      </div>

      {/* Search with Storage Manager Style */}
      <div style={{
        marginBottom: '32px',
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Monitor size={20} style={{
            position: 'absolute',
            left: '16px',
            color: '#5b4632',
            zIndex: 1
          }} />
          <input
            type="text"
            placeholder="🔍 Search demos by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="demo-search-input"
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
      </div>

      {/* Demos Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {filteredDemos.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6B7280'
          }}>
            <Monitor size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>
              {searchTerm ? 'No demos found matching your search.' : 'No demos yet.'}
            </p>
            <p style={{ fontSize: '14px' }}>
              {searchTerm ? 'Try adjusting your search terms.' : 'Click "Add New Demo" to create your first demo showcase.'}
            </p>
          </div>
        ) : (
          filteredDemos.map((demo) => (
            <div
              key={demo.id}
              data-testid={`demo-card-${demo.id}`}
              style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                border: '1px solid #E5E7EB'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', paddingTop: '60%', background: '#F3F4F6' }}>
                <img
                  src={demo.image_url || demo.image}
                  alt={demo.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <span className="admin-badge admin-badge-primary" style={{ background: '#a34e1d' }}>
                    {demo.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#352a21',
                  marginBottom: '8px',
                  lineHeight: '1.4'
                }}>
                  {demo.title}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  marginBottom: '16px',
                  lineHeight: '1.6',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {demo.description}
                </p>

                {/* Tech Stack */}
                {(demo.tech_stack || demo.techStack)?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      {(demo.tech_stack || demo.techStack).slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '12px',
                            padding: '4px 10px',
                            background: '#F3F4F6',
                            color: '#4B5563',
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                      {(demo.tech_stack || demo.techStack).length > 4 && (
                        <span style={{
                          fontSize: '12px',
                          padding: '4px 10px',
                          color: '#6B7280'
                        }}>
                          +{(demo.tech_stack || demo.techStack).length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Demo URL */}
                <div style={{
                  fontSize: '13px',
                  color: '#a34e1d',
                  marginBottom: '16px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Code size={14} />
                  {demo.live_demo_url}
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  paddingTop: '16px',
                  borderTop: '1px solid #E5E7EB'
                }}>
                  <a
                    href={demo.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                    data-testid={`view-demo-${demo.id}`}
                  >
                    <ExternalLink size={14} />
                    <span>View Demo</span>
                  </a>
                  <button
                    onClick={() => handleOpenModal(demo)}
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    title="Edit Demo"
                    data-testid={`edit-demo-${demo.id}`}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(demo.id, demo.title)}
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    title="Delete Demo"
                    data-testid={`delete-demo-${demo.id}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}
          >
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingDemo ? 'Edit Demo Showcase' : 'Add New Demo Showcase'}
              </h2>
              <button onClick={handleCloseModal} className="admin-modal-close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                {/* Basic Information */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#352a21' }}>
                    Basic Information
                  </h3>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Demo Title *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="E-commerce Platform Demo"
                      required
                      data-testid="demo-title-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="E-commerce, Corporate, SaaS, etc."
                      data-testid="demo-category-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Description *</label>
                    <textarea
                      className="admin-form-textarea"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows="3"
                      placeholder="Brief description of what this demo showcases..."
                      required
                      data-testid="demo-description-textarea"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Image URL *</label>
                    <input
                      type="url"
                      className="admin-form-input"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/demo-image.jpg"
                      required
                      data-testid="demo-image-url-input"
                    />
                  </div>
                </div>

                {/* Demo Details */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#352a21' }}>
                    Demo Details
                  </h3>

                  {/* Link Type Selection - Storage Manager Style */}
                  <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                    <label
                      htmlFor="demo-link-type"
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151'
                      }}
                    >
                      Demo Link Type
                    </label>
                    <select
                      id="demo-link-type"
                      value={formData.demo_link_type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setFormData({
                          ...formData,
                          demo_link_type: newType,
                          live_demo_url: newType === 'internal' ? '/demo/' : 'https://'
                        });
                        setShowPreview(false);
                      }}
                      data-testid="demo-link-type-select"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '15px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '8px',
                        background: 'white',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#5b4632'}
                      onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                    >
                      <option value="internal">🏠 Internal Path (Local Demo)</option>
                      <option value="external">🌐 External Link (External URL)</option>
                    </select>
                    <small style={{ color: '#6B7280', fontSize: '12px', marginTop: '6px', display: 'block' }}>
                      {formData.demo_link_type === 'internal'
                        ? 'Use internal routing for demos hosted within the app (e.g., /demo/ecommerce)'
                        : 'Link to external URLs for demos hosted elsewhere (e.g., https://example.com)'}
                    </small>
                  </div>

                  <div className="admin-form-group">
                    <label
                      htmlFor="demo-url"
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151'
                      }}
                    >
                      {formData.demo_link_type === 'internal' ? 'Demo URL Path' : 'External Demo URL'}
                      <span style={{ color: '#EF4444' }}> *</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="demo-url"
                        type="text"
                        value={formData.live_demo_url}
                        onChange={(e) => handleInputChange('live_demo_url', e.target.value)}
                        placeholder={formData.demo_link_type === 'internal'
                          ? '/demo/your-demo-name'
                          : 'https://external-demo-site.com'}
                        required
                        data-testid="demo-url-input"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          paddingRight: '100px',
                          fontSize: '15px',
                          border: '2px solid #E5E7EB',
                          borderRadius: '8px',
                          transition: 'all 0.2s',
                          outline: 'none'
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
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: '6px 12px',
                          fontSize: '13px',
                          fontWeight: '500',
                          background: showPreview ? '#5b4632' : '#F3F4F6',
                          color: showPreview ? 'white' : '#4B5563',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s'
                        }}
                        data-testid="toggle-preview-button"
                      >
                        <Eye size={14} />
                        {showPreview ? 'Hide' : 'Preview'}
                      </button>
                    </div>
                    <small style={{ color: '#6B7280', fontSize: '12px', marginTop: '6px', display: 'block' }}>
                      {formData.demo_link_type === 'internal'
                        ? 'Example: /demo/ecommerce, /demo/corporate, /demo/saas-landing'
                        : 'Example: https://example.com, https://demo.yoursite.com'}
                    </small>

                    {/* Live Preview Section */}
                    {showPreview && formData.live_demo_url && (
                      <div style={{
                        marginTop: '16px',
                        border: '2px solid #5b4632',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#F9FAFB'
                      }}>
                        <div style={{
                          padding: '12px 16px',
                          background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Monitor size={16} />
                          Live Preview
                        </div>
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          height: '400px',
                          background: 'white'
                        }}>
                          <iframe
                            src={formData.live_demo_url.startsWith('http')
                              ? formData.live_demo_url
                              : `${window.location.origin}${formData.live_demo_url}`}
                            title="Demo Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              border: 'none'
                            }}
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                            onError={(e) => {
                              console.error('Failed to load preview');
                            }}
                          />
                        </div>
                        <div style={{
                          padding: '8px 16px',
                          background: '#F3F4F6',
                          fontSize: '12px',
                          color: '#6B7280',
                          textAlign: 'center'
                        }}>
                          Preview may not display all features due to iframe restrictions
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={formData.tech_stack.join(', ')}
                      onChange={(e) => handleArrayChange('tech_stack', e.target.value)}
                      placeholder="React, Node.js, MongoDB, Tailwind CSS"
                      data-testid="demo-tech-stack-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Case Study / Additional Details</label>
                    <textarea
                      className="admin-form-textarea"
                      value={formData.case_study_content}
                      onChange={(e) => handleInputChange('case_study_content', e.target.value)}
                      rows="5"
                      placeholder="Detailed information about this demo, features included, purpose, etc..."
                      data-testid="demo-case-study-textarea"
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="admin-btn admin-btn-secondary"
                  data-testid="cancel-demo-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  data-testid="save-demo-button"
                >
                  <Monitor size={18} />
                  {editingDemo ? 'Update Demo' : 'Add Demo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoManager;
