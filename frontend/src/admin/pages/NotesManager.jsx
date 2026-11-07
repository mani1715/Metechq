import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Save, X, Tag, StickyNote, FileText } from 'lucide-react';
import { noteService } from '../../services/noteService';
import { toast } from 'sonner';

const NotesManager = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async (search = '') => {
    try {
      setLoading(true);
      const data = await noteService.getAllNotes(search);
      setNotes(data);
    } catch (error) {
      toast.error('Failed to fetch notes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchNotes(query);
  };

  const handleCreate = () => {
    setEditingNote(null);
    setFormData({ name: '', content: '', tags: [] });
    setTagInput('');
    setShowModal(true);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      name: note.name,
      content: note.content,
      tags: note.tags || []
    });
    setTagInput('');
    setShowModal(true);
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await noteService.deleteNote(noteId);
      toast.success('Note deleted successfully');
      fetchNotes(searchQuery);
    } catch (error) {
      toast.error('Failed to delete note');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter a name for the note');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Please enter content for the note');
      return;
    }

    try {
      if (editingNote) {
        await noteService.updateNote(editingNote.id, formData);
        toast.success('Note updated successfully');
      } else {
        await noteService.createNote(formData);
        toast.success('Note created successfully');
      }
      setShowModal(false);
      fetchNotes(searchQuery);
    } catch (error) {
      toast.error(editingNote ? 'Failed to update note' : 'Failed to create note');
      console.error(error);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
  };

  if (loading) {
    return <div className="admin-page"><p>Loading...</p></div>;
  }

  const filteredNotes = notes.filter(note =>
    note.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

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
          <h1 data-testid="notes-manager-heading" style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            📝 Text Notes Manager
          </h1>
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            margin: 0
          }}>
            Save and manage text content with searchable names
          </p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={handleCreate}
          data-testid="add-note-btn"
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
          <Plus size={20} /> Add New Note
        </button>
      </div>

      {/* Search Bar */}
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
            placeholder="🔍 Search notes by name, content, or tags..."
            value={searchQuery}
            onChange={handleSearch}
            data-testid="notes-search-input"
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

      {/* Notes Grid */}
      <div className="admin-grid" data-testid="notes-grid">
        {filteredNotes.map((note) => (
          <div key={note.id} className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-icon">
                <FileText size={20} />
              </div>
              <div className="admin-card-actions">
                <button
                  className="admin-btn-icon"
                  onClick={() => handleEdit(note)}
                  data-testid={`edit-note-${note.id}`}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="admin-btn-icon admin-btn-danger"
                  onClick={() => handleDelete(note.id)}
                  data-testid={`delete-note-${note.id}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3>{note.name}</h3>
            <p className="admin-card-preview">
              {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
            </p>
            {note.tags && note.tags.length > 0 && (
              <div className="admin-card-tags">
                {note.tags.map((tag, idx) => (
                  <span key={idx} className="admin-badge">{tag}</span>
                ))}
              </div>
            )}
            <p className="admin-card-meta" style={{ marginTop: '12px', fontSize: '13px', color: '#9CA3AF' }}>
              Updated: {formatDate(note.updated_at)}
            </p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="admin-empty-state">
          <StickyNote size={48} />
          <h3>No notes found</h3>
          <p>Create your first note to save text content</p>
          <button
            onClick={handleCreate}
            style={{
              marginTop: '20px',
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Plus size={20} /> Create Note
          </button>
        </div>
      )}

      {/* Modal */}
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
                {editingNote ? 'Edit Note' : 'Create New Note'}
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
              {/* Name/Title Field */}
              <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="note-name"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Name/Title <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="note-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter a searchable name for this note"
                  data-testid="note-name-input"
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

              {/* Content Field */}
              <div className="admin-form-group" style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="note-content"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Content <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  id="note-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  placeholder="Enter your text content here..."
                  required
                  data-testid="note-content-textarea"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
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
                  htmlFor="note-tags"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Tags <span style={{ fontSize: '12px', fontWeight: '400', color: '#6B7280' }}>(Optional)</span>
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    id="note-tags"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tags..."
                    data-testid="note-tags-input"
                    style={{
                      flex: 1,
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
                  <button
                    type="button"
                    onClick={addTag}
                    style={{
                      padding: '12px 20px',
                      fontSize: '15px',
                      fontWeight: '600',
                      border: '2px solid #5b4632',
                      borderRadius: '8px',
                      background: 'white',
                      color: '#5b4632',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Tag size={16} /> Add
                  </button>
                </div>

                {/* Tags Display */}
                {formData.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: '#EDE9FE',
                          color: '#a34e1d',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#a34e1d',
                            cursor: 'pointer',
                            padding: '0',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                  data-testid="note-save-btn"
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
                  <Save size={16} /> {editingNote ? 'Update Note' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesManager;
