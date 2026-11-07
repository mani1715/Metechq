import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, X, ExternalLink, Star, Lock,
  Github, Video, Image as ImageIcon, Users, Clock, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAdmin } from '../context/AdminContext';

const PortfolioManager = () => {
  const { adminData, addProject, updateProject, deleteProject, fetchProjects } = useAdmin();
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'E-commerce',
    description: '',
    image_url: '',
    tech_stack: [],
    featured: false,
    is_private: false,
    live_demo_url: '',
    status: 'completed',
    github_url: '',
    client_name: '',
    demo_video_url: '',
    gallery_images: [],
    project_duration: '',
    team_size: '',
    key_features: [],
    case_study_content: ''
  });

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const categories = ['E-commerce', 'Corporate', 'SaaS', 'Mobile', 'Education', 'Real Estate', 'Healthcare', 'Finance', 'Other'];
  const statusOptions = ['completed', 'in-progress', 'maintenance'];

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || '',
        slug: project.slug || '',
        category: project.category || 'E-commerce',
        description: project.description || '',
        image_url: project.image_url || project.image || '',
        tech_stack: project.tech_stack || project.techStack || [],
        featured: project.featured || false,
        is_private: project.is_private || false,
        live_demo_url: project.live_demo_url || project.liveUrl || '',
        status: project.status || 'completed',
        github_url: project.github_url || '',
        client_name: project.client_name || '',
        demo_video_url: project.demo_video_url || '',
        gallery_images: project.gallery_images || [],
        project_duration: project.project_duration || '',
        team_size: project.team_size || '',
        key_features: project.key_features || [],
        case_study_content: project.case_study_content || ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        slug: '',
        category: 'E-commerce',
        description: '',
        image_url: '',
        tech_stack: [],
        featured: false,
        is_private: false,
        live_demo_url: '',
        status: 'completed',
        github_url: '',
        client_name: '',
        demo_video_url: '',
        gallery_images: [],
        project_duration: '',
        team_size: '',
        key_features: [],
        case_study_content: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const projectData = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      category: formData.category,
      description: formData.description,
      image_url: formData.image_url,
      tech_stack: formData.tech_stack,
      featured: formData.featured,
      is_private: formData.is_private,
      live_demo_url: formData.live_demo_url,
      status: formData.status,
      github_url: formData.github_url,
      client_name: formData.client_name,
      demo_video_url: formData.demo_video_url,
      gallery_images: formData.gallery_images,
      project_duration: formData.project_duration,
      team_size: formData.team_size,
      key_features: formData.key_features,
      case_study_content: formData.case_study_content
    };

    setSaving(true);
    try {
      if (editingProject) await updateProject(editingProject.id, projectData);
      else await addProject(projectData);
      handleCloseModal();
    } catch (error) {
      const detail = error.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Could not save the project. Check your links and try again.');
    } finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(id);
    }
  };

  // Filter projects
  const filteredProjects = adminData.projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#352a21', margin: '0 0 8px 0' }}>
            Portfolio Manager
          </h1>
          <p style={{ color: '#6B7280', margin: 0 }}>
            Add your real projects, screenshots, and deployed links. Showing {filteredProjects.length} of {adminData.projects.length} projects
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="admin-btn admin-btn-primary"
          data-testid="add-project-button"
        >
          <Plus size={18} />
          Add New Project
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-form-input"
          style={{ flex: '1', minWidth: '250px', maxWidth: '400px' }}
          data-testid="search-projects-input"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="admin-form-select"
          style={{ minWidth: '150px' }}
          data-testid="filter-category-select"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="admin-form-select"
          style={{ minWidth: '150px' }}
          data-testid="filter-status-select"
        >
          <option value="all">All Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Table */}
      <div className="admin-table">
        <div className="admin-table-content">
          <table className="admin-table-main">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Tech Stack</th>
                <th>Status</th>
                <th>Details</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                    No projects found. {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' ? 'Try adjusting your filters.' : 'Click "Add New Project" to get started.'}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} data-testid={`project-row-${project.id}`}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={project.image_url || project.image}
                          alt={project.title}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', color: '#352a21' }}>
                            {project.title}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6B7280' }}>
                            {project.slug}
                          </div>
                          {project.client_name && (
                            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                              Client: {project.client_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-primary">
                        {project.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>
                        {(project.tech_stack || project.techStack)?.slice(0, 3).join(', ')}
                        {(project.tech_stack || project.techStack)?.length > 3 &&
                          ` +${(project.tech_stack || project.techStack).length - 3}`}
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge ${
                        project.status === 'completed' ? 'admin-badge-success' :
                        project.status === 'in-progress' ? 'admin-badge-warning' :
                        'admin-badge-secondary'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                        {project.github_url && (
                          <span title="GitHub Repo">
                            <Github size={14} />
                          </span>
                        )}
                        {project.demo_video_url && (
                          <span title="Demo Video">
                            <Video size={14} />
                          </span>
                        )}
                        {project.gallery_images?.length > 0 && (
                          <span title={`${project.gallery_images.length} Gallery Images`}>
                            <ImageIcon size={14} /> {project.gallery_images.length}
                          </span>
                        )}
                        {project.team_size && (
                          <span title={`Team Size: ${project.team_size}`}>
                            <Users size={14} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {project.featured && (
                          <Star size={16} fill="#c5792c" color="#c5792c" title="Featured" />
                        )}
                        <span className={project.is_private ? "admin-badge admin-badge-warning" : "admin-badge admin-badge-success"}>
                          {project.is_private ? "Private" : "Public"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {(project.live_demo_url || project.liveUrl) && (
                          <a
                            href={project.live_demo_url || project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            title="View Live Demo"
                            data-testid={`view-demo-${project.id}`}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenModal(project)}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          title="Edit Project"
                          data-testid={`edit-project-${project.id}`}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          title="Delete Project"
                          data-testid={`delete-project-${project.id}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}
          >
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={handleCloseModal} className="admin-modal-close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                {/* Basic Information */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#352a21' }}>
                    Basic Information
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Project Title *</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                        data-testid="project-title-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Slug (URL-friendly)</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        placeholder="Auto-generated from title"
                        data-testid="project-slug-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Category *</label>
                      <select
                        className="admin-form-select"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        required
                        data-testid="project-category-select"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Status *</label>
                      <select
                        className="admin-form-select"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        required
                        data-testid="project-status-select"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Description *</label>
                    <textarea
                      className="admin-form-textarea"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows="4"
                      required
                      data-testid="project-description-textarea"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#352a21' }}>
                    Project Details
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Client Name</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={formData.client_name}
                        onChange={(e) => handleInputChange('client_name', e.target.value)}
                        placeholder="e.g., ABC Corporation"
                        data-testid="project-client-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Project Duration</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={formData.project_duration}
                        onChange={(e) => handleInputChange('project_duration', e.target.value)}
                        placeholder="e.g., 3 months"
                        data-testid="project-duration-input"
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Team Size</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={formData.team_size}
                      onChange={(e) => handleInputChange('team_size', e.target.value)}
                      placeholder="e.g., 5 developers"
                      data-testid="project-team-size-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={formData.tech_stack.join(', ')}
                      onChange={(e) => handleArrayChange('tech_stack', e.target.value)}
                      placeholder="React, Node.js, MongoDB, AWS"
                      data-testid="project-tech-stack-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Key Features (comma-separated)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={formData.key_features.join(', ')}
                      onChange={(e) => handleArrayChange('key_features', e.target.value)}
                      placeholder="Real-time chat, Payment integration, Analytics dashboard"
                      data-testid="project-key-features-input"
                    />
                  </div>
                </div>

                {/* Media & Links */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#352a21' }}>
                    Media & Links
                  </h3>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Main Image URL *</label>
                    <input
                      type="url"
                      className="admin-form-input"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      required
                      data-testid="project-image-url-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Gallery Images (comma-separated URLs)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={formData.gallery_images.join(', ')}
                      onChange={(e) => handleArrayChange('gallery_images', e.target.value)}
                      placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                      data-testid="project-gallery-images-input"
                    />
                    <small style={{ color: '#6B7280', fontSize: '12px' }}>
                      Add multiple images for project gallery showcase
                    </small>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Deployed website URL</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={formData.live_demo_url}
                      onChange={(e) => handleInputChange('live_demo_url', e.target.value)}
                      placeholder="/demo/project or https://live-site.com"
                      data-testid="project-demo-url-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">GitHub Repository URL</label>
                      <input
                        type="url"
                        className="admin-form-input"
                        value={formData.github_url}
                        onChange={(e) => handleInputChange('github_url', e.target.value)}
                        placeholder="https://github.com/username/repo"
                        data-testid="project-github-url-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Demo Video URL</label>
                      <input
                        type="url"
                        className="admin-form-input"
                        value={formData.demo_video_url}
                        onChange={(e) => handleInputChange('demo_video_url', e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        data-testid="project-video-url-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Case Study */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#352a21' }}>
                    Case Study (Optional)
                  </h3>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Detailed Case Study Content</label>
                    <textarea
                      className="admin-form-textarea"
                      value={formData.case_study_content}
                      onChange={(e) => handleInputChange('case_study_content', e.target.value)}
                      rows="6"
                      placeholder="Detailed description of the project challenge, solution, and results..."
                      data-testid="project-case-study-textarea"
                    />
                  </div>
                </div>

                {/* Visibility Settings */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#352a21' }}>
                    Visibility Settings
                  </h3>

                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        data-testid="project-featured-checkbox"
                      />
                      <Star size={16} />
                      <span>Featured Project</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.is_private}
                        onChange={(e) => handleInputChange('is_private', e.target.checked)}
                        data-testid="project-private-checkbox"
                      />
                      <Lock size={16} />
                      <span>Private (Hidden from public portfolio)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="admin-btn admin-btn-secondary"
                  data-testid="cancel-project-button"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={saving}
                  className="admin-btn admin-btn-primary"
                  data-testid="save-project-button"
                >
                  <CheckCircle size={18} />
                  {editingProject ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;
