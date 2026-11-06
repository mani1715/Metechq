import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Eye, FileText, Calendar, Tag } from 'lucide-react';
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../../services/blogService';
import { toast } from 'sonner';

const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    category: 'Web Development',
    tags: [],
    author: 'METECHQ',
    status: 'draft',
    seo_title: '',
    seo_description: ''
  });

  const categories = ['Web Development', 'Mobile Development', 'UI/UX Design', 'Backend Development', 'DevOps', 'AI/ML', 'Cloud Computing', 'Cybersecurity', 'Other'];

  // Fetch blogs on mount
  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blogs');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        cover_image: blog.cover_image || '',
        category: blog.category || 'Web Development',
        tags: blog.tags || [],
        author: blog.author || 'METECHQ',
        status: blog.status || 'draft',
        seo_title: blog.seo_title || '',
        seo_description: blog.seo_description || ''
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        cover_image: '',
        category: 'Web Development',
        tags: [],
        author: 'METECHQ',
        status: 'draft',
        seo_title: '',
        seo_description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlog(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(t => t.trim()).filter(t => t);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const blogData = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };

      if (editingBlog) {
        await updateBlog(editingBlog.id, blogData);
        toast.success('Blog updated successfully');
      } else {
        await createBlog(blogData);
        toast.success('Blog created successfully');
      }
      
      handleCloseModal();
      fetchAllBlogs();
    } catch (error) {
      toast.error(editingBlog ? 'Failed to update blog' : 'Failed to create blog');
      console.error('Error saving blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await deleteBlog(id);
      toast.success('Blog deleted successfully');
      fetchAllBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
      console.error('Error deleting blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    try {
      setLoading(true);
      await updateBlog(blog.id, { status: newStatus });
      toast.success(`Blog ${newStatus === 'published' ? 'published' : 'saved as draft'}`);
      fetchAllBlogs();
    } catch (error) {
      toast.error('Failed to update blog status');
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || blog.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1C2A3A', margin: '0 0 8px 0' }}>
            Blog Manager
          </h1>
          <p style={{ color: '#6B7280', margin: 0 }}>
            Manage your blog posts - {filteredBlogs.length} of {blogs.length} blogs
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="admin-btn admin-btn-primary"
          disabled={loading}
        >
          <Plus size={18} />
          Create New Blog
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
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-form-input"
          style={{ flex: '1', minWidth: '250px', maxWidth: '400px' }}
        />
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="admin-form-select"
          style={{ minWidth: '150px' }}
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
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Blog Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && blogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                      ? 'No blogs match your filters'
                      : 'No blogs yet. Create your first blog post!'}
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <div style={{ fontWeight: '500', color: '#1C2A3A' }}>
                        {blog.title}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                        {blog.excerpt?.substring(0, 60)}...
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
                        {blog.category}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleStatus(blog)}
                        className="admin-badge"
                        style={{ 
                          background: blog.status === 'published' ? '#DCFCE7' : '#FEF3C7',
                          color: blog.status === 'published' ? '#16A34A' : '#D97706',
                          cursor: 'pointer',
                          border: 'none',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                        disabled={loading}
                      >
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td>{blog.author}</td>
                    <td>{formatDate(blog.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {blog.status === 'published' && (
                          <a
                            href={`/blogs/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-icon-btn"
                            title="View Blog"
                          >
                            <Eye size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenModal(blog)}
                          className="admin-icon-btn admin-icon-btn-primary"
                          title="Edit"
                          disabled={loading}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="admin-icon-btn admin-icon-btn-danger"
                          title="Delete"
                          disabled={loading}
                        >
                          <Trash2 size={16} />
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

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={handleCloseModal}>
          <div 
            className="admin-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '900px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}
          >
            <div className="admin-modal-header">
              <h2>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
              <button onClick={handleCloseModal} className="admin-modal-close">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-modal-body">
              {/* Title */}
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Title <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="admin-form-input"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              {/* Slug */}
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Slug (URL-friendly identifier)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="admin-form-input"
                  placeholder="auto-generated-from-title"
                />
                <small style={{ color: '#6B7280', fontSize: '12px' }}>
                  Leave empty to auto-generate from title
                </small>
              </div>

              {/* Excerpt */}
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Excerpt <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  className="admin-form-textarea"
                  placeholder="Brief description of the blog post"
                  rows={3}
                  required
                />
              </div>

              {/* Content */}
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Content <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="admin-form-textarea"
                  placeholder="Write your blog content here (HTML supported)"
                  rows={12}
                  required
                />
                <small style={{ color: '#6B7280', fontSize: '12px' }}>
                  HTML tags are supported for rich formatting
                </small>
              </div>

              {/* Cover Image */}
              <div className="admin-form-group">
                <label className="admin-form-label">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.cover_image}
                  onChange={(e) => handleInputChange('cover_image', e.target.value)}
                  className="admin-form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Category and Author */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="admin-form-select"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className="admin-form-input"
                    placeholder="METECHQ"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="admin-form-group">
                <label className="admin-form-label">Tags</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="admin-form-input"
                  placeholder="React, JavaScript, Web Development (comma separated)"
                />
              </div>

              {/* SEO Fields */}
              <div className="admin-form-group">
                <label className="admin-form-label">SEO Title</label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => handleInputChange('seo_title', e.target.value)}
                  className="admin-form-input"
                  placeholder="SEO optimized title"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">SEO Description</label>
                <textarea
                  value={formData.seo_description}
                  onChange={(e) => handleInputChange('seo_description', e.target.value)}
                  className="admin-form-textarea"
                  placeholder="SEO optimized description"
                  rows={3}
                />
              </div>

              {/* Status */}
              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="admin-form-select"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="admin-btn admin-btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-btn admin-btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingBlog ? 'Update Blog' : 'Create Blog')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsManager;
