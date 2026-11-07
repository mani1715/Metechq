import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import axios from 'axios';
import { getBackendURL } from '../../lib/utils';

const BACKEND_URL = getBackendURL();

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '⭐'
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/skills`);
      setSkills(response.data.skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');

    try {
      if (editingSkill) {
        await axios.put(
          `${BACKEND_URL}/skills/${editingSkill.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${BACKEND_URL}/skills`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchSkills();
      closeModal();
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
      await axios.delete(`${BACKEND_URL}/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    }
  };

  const openModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        icon: skill.icon
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: '',
        icon: '⭐'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSkill(null);
  };

  // Popular emoji icons for quick selection
  const emojiOptions = [
    '⭐', '🚀', '💻', '🌐', '⚡', '🎨', '🔧', '📱',
    '🐍', '⚛️', '🟢', '🔷', '🔴', '🟡', '🟣', '🟠'
  ];

  if (loading) {
    return <div className="admin-page"><p>Loading...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 data-testid="skills-manager-heading">Skills Management</h1>
          <p>Manage your technical skills and expertise</p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => openModal()}
          data-testid="add-skill-btn"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      <div className="admin-grid" data-testid="skills-grid">
        {skills.map((skill) => (
          <div key={skill.id} className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-icon" style={{ fontSize: '32px' }}>
                {skill.icon}
              </div>
              <div className="admin-card-actions">
                <button
                  className="admin-btn-icon"
                  onClick={() => openModal(skill)}
                  data-testid={`edit-skill-${skill.id}`}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="admin-btn-icon admin-btn-danger"
                  onClick={() => handleDelete(skill.id)}
                  data-testid={`delete-skill-${skill.id}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3>{skill.name}</h3>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="admin-empty-state">
          <h3>No skills yet</h3>
          <p>Add your first skill to showcase your expertise</p>
        </div>
      )}

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h2>
              <button className="admin-btn-icon" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="JavaScript, React, Python..."
                  required
                  data-testid="skill-name-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Icon Emoji</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="⭐"
                  style={{ fontSize: '24px', width: '80px' }}
                  data-testid="skill-icon-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Quick Select</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      style={{
                        fontSize: '24px',
                        padding: '8px',
                        border: formData.icon === emoji ? '2px solid #a34e1d' : '1px solid #ddd',
                        borderRadius: '4px',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" data-testid="skill-save-btn">
                  <Save size={16} /> {editingSkill ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManager;
