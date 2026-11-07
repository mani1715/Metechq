import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Download, Users, AlertCircle } from 'lucide-react';
import newsletterService from '../../services/newsletterService';

const NewsletterManager = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await newsletterService.getAllSubscribers();
      setSubscribers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch subscribers');
      console.error('Error fetching subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subscriberId) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) {
      return;
    }

    try {
      setDeleteLoading(subscriberId);
      await newsletterService.deleteSubscriber(subscriberId);
      setSubscribers(subscribers.filter(sub => sub.id !== subscriberId));
    } catch (err) {
      alert(err.message || 'Failed to delete subscriber');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleExport = async () => {
    try {
      const data = await newsletterService.exportSubscribers();

      // Create a Blob from the CSV content
      const blob = new Blob([data.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Failed to export subscribers');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-primary" />
            <h1 className="admin-page-title">Newsletter Subscribers</h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted">Loading subscribers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Mail className="w-8 h-8 text-primary" />
          <div>
            <h1 className="admin-page-title" style={{ marginBottom: '0.25rem' }}>Newsletter Subscribers</h1>
            <p className="text-sm text-muted">
              Manage your newsletter subscriber list
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="admin-button admin-button-secondary"
          disabled={subscribers.length === 0}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Card */}
      <div className="admin-card mb-6" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            padding: '0.875rem',
            backgroundColor: 'rgba(163, 78, 29, 0.1)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted" style={{ marginBottom: '0.25rem' }}>Total Subscribers</p>
            <p className="text-2xl font-bold text-foreground" style={{ lineHeight: '1' }}>{subscribers.length}</p>
          </div>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="admin-card">
        {subscribers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mail className="w-12 h-12 text-muted" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: 'var(--color-text)'
            }}>
              No subscribers yet
            </h3>
            <p className="text-muted" style={{ maxWidth: '400px' }}>
              Subscribers will appear here once people sign up for your newsletter
            </p>
          </div>
        ) : (
          <div className="admin-table-container" style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1rem' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '1rem', width: '120px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '1rem', width: '200px' }}>Subscribed Date</th>
                  <th style={{ textAlign: 'right', padding: '1rem', width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail className="w-4 h-4 text-muted" />
                        <span style={{ fontWeight: '500' }}>{subscriber.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`admin-badge ${
                        subscriber.status === 'subscribed'
                          ? 'admin-badge-success'
                          : 'admin-badge-secondary'
                      }`} style={{ display: 'inline-block' }}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="text-muted" style={{ padding: '1rem' }}>
                      {formatDate(subscriber.created_at)}
                    </td>
                    <td style={{ textAlign: 'right', padding: '1rem' }}>
                      <button
                        onClick={() => handleDelete(subscriber.id)}
                        disabled={deleteLoading === subscriber.id}
                        className="admin-icon-button admin-icon-button-danger"
                        title="Delete subscriber"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {deleteLoading === subscriber.id ? (
                          <div className="spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterManager;
