import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Edit, Plus, Clock, CheckCircle, X, Save } from 'lucide-react';
import contactService from '../../services/contactService';
import { toast } from 'sonner';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  // Load contacts on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllContacts();
      setContacts(data);
    } catch (error) {
      toast.error('Failed to load contacts');
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'unread') return !contact.read;
    if (filter === 'read') return contact.read;
    return true;
  });

  const unreadCount = contacts.filter(c => !c.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await contactService.markAsRead(id, true);
      setContacts(contacts.map(c =>
        c.id === id ? { ...c, read: true } : c
      ));
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      try {
        await contactService.deleteContact(id);
        setContacts(contacts.filter(c => c.id !== id));
        if (selectedContact?.id === id) {
          setSelectedContact(null);
        }
        toast.success('Contact deleted successfully');
      } catch (error) {
        toast.error('Failed to delete contact');
      }
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      service: contact.service || '',
      message: contact.message
    });
    setIsEditMode(true);
    setSelectedContact(contact);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
    setIsCreateMode(true);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEditMode && selectedContact) {
        // Update existing contact
        const updated = await contactService.updateContact(selectedContact.id, formData);
        setContacts(contacts.map(c =>
          c.id === selectedContact.id ? updated : c
        ));
        toast.success('Contact updated successfully');
        setIsEditMode(false);
        setSelectedContact(null);
      } else if (isCreateMode) {
        // Create new contact
        const newContact = await contactService.createContact(formData);
        setContacts([newContact, ...contacts]);
        toast.success('Contact created successfully');
        setIsCreateMode(false);
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      toast.error(isEditMode ? 'Failed to update contact' : 'Failed to create contact');
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setIsCreateMode(false);
    setSelectedContact(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <div style={{ fontSize: '18px', color: '#6B7280' }}>Loading contacts...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#352a21', margin: '0 0 8px 0' }}>
            Contact Submissions
          </h1>
          <p style={{ color: '#6B7280', margin: 0 }}>
            {unreadCount} unread messages • {contacts.length} total
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="admin-btn admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          Add New Contact
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        borderBottom: '2px solid #E5E7EB',
        paddingBottom: '0'
      }}>
        {[
          { id: 'all', label: 'All Messages' },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'read', label: 'Read' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: filter === tab.id ? '2px solid #a34e1d' : '2px solid transparent',
              color: filter === tab.id ? '#a34e1d' : '#6B7280',
              fontWeight: filter === tab.id ? '600' : '400',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredContacts.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">📧</div>
          <h3 className="admin-empty-title">No messages found</h3>
          <p className="admin-empty-description">
            {filter === 'unread' ? 'All caught up! No unread messages.' : 'No contact submissions yet.'}
          </p>
        </div>
      ) : (
        <div className="admin-table">
          <div className="admin-table-content">
            <table className="admin-table-main">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Message Preview</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    style={{
                      background: !contact.read ? 'rgba(163, 78, 29, 0.02)' : 'transparent',
                    }}
                  >
                    <td>
                      {!contact.read ? (
                        <span className="admin-badge admin-badge-warning">
                          <Mail size={12} /> Unread
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge-success">
                          <CheckCircle size={12} /> Read
                        </span>
                      )}
                    </td>
                    <td style={{ fontWeight: !contact.read ? '600' : '400' }}>
                      {contact.name}
                    </td>
                    <td style={{ color: '#6B7280', fontSize: '14px' }}>
                      {contact.email}
                    </td>
                    <td style={{ color: '#6B7280', fontSize: '14px' }}>
                      {contact.phone || '-'}
                    </td>
                    <td style={{ color: '#6B7280', fontSize: '14px' }}>
                      {contact.service || '-'}
                    </td>
                    <td style={{
                      maxWidth: '300px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#6B7280',
                      fontSize: '14px'
                    }}>
                      {contact.message}
                    </td>
                    <td style={{ color: '#6B7280', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {formatDate(contact.created_at)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            if (!contact.read) {
                              handleMarkAsRead(contact.id);
                            }
                          }}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          title="View Details"
                        >
                          <Mail size={14} />
                        </button>
                        <button
                          onClick={() => handleEdit(contact)}
                          className="admin-btn admin-btn-primary admin-btn-sm"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedContact && !isEditMode && (
        <div className="admin-modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Contact Details</h2>
              <button onClick={() => setSelectedContact(null)} className="admin-modal-close">
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#352a21', margin: '0 0 4px 0' }}>
                      {selectedContact.name}
                    </h3>
                    <p style={{ color: '#6B7280', margin: 0 }}>
                      {formatDate(selectedContact.created_at)}
                    </p>
                  </div>
                  {!selectedContact.read ? (
                    <span className="admin-badge admin-badge-warning">New</span>
                  ) : (
                    <span className="admin-badge admin-badge-success">Read</span>
                  )}
                </div>

                <div style={{
                  background: '#F8F9FA',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Email</div>
                    <a href={`mailto:${selectedContact.email}`} style={{
                      fontSize: '15px',
                      color: '#a34e1d',
                      textDecoration: 'none'
                    }}>
                      {selectedContact.email}
                    </a>
                  </div>
                  {selectedContact.phone && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Phone</div>
                      <a href={`tel:${selectedContact.phone}`} style={{
                        fontSize: '15px',
                        color: '#a34e1d',
                        textDecoration: 'none'
                      }}>
                        {selectedContact.phone}
                      </a>
                    </div>
                  )}
                  {selectedContact.service && (
                    <div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>Service Interested</div>
                      <div style={{ fontSize: '15px', color: '#374151' }}>
                        {selectedContact.service}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', fontWeight: '600' }}>Message</div>
                  <div style={{
                    fontSize: '15px',
                    color: '#374151',
                    lineHeight: '1.6',
                    padding: '16px',
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}>
                    {selectedContact.message}
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                onClick={() => handleEdit(selectedContact)}
                className="admin-btn admin-btn-primary"
              >
                <Edit size={18} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(selectedContact.id)}
                className="admin-btn admin-btn-danger"
              >
                <Trash2 size={18} />
                Delete
              </button>
              <button onClick={() => setSelectedContact(null)} className="admin-btn admin-btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {(isEditMode || isCreateMode) && (
        <div className="admin-modal-overlay" onClick={handleCancel}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {isEditMode ? 'Edit Contact' : 'Add New Contact'}
              </h2>
              <button onClick={handleCancel} className="admin-modal-close">
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="admin-input"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Email <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="admin-input"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="admin-input"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Service Interested
                  </label>
                  <input
                    type="text"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="admin-input"
                    placeholder="Enter service"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Message <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="admin-input"
                    rows="6"
                    placeholder="Enter message"
                  />
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                onClick={handleSave}
                className="admin-btn admin-btn-primary"
              >
                <Save size={18} />
                {isEditMode ? 'Update' : 'Create'}
              </button>
              <button onClick={handleCancel} className="admin-btn admin-btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManager;
