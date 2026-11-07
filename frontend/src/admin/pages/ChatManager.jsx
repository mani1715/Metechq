import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Trash2, Mail, Phone, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { getBackendURL } from '../../lib/utils';

const BACKEND_URL = getBackendURL();

const ChatManager = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    fetchConversations();
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
      const response = await axios.get(`${BACKEND_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data.conversations);
      setTotalUnread(response.data.totalUnread);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conv) => {
    setSelectedConv(conv);

    // Mark as read if there are unread messages
    if (conv.unreadCount > 0) {
      try {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
        await axios.put(
          `${BACKEND_URL}/chat/conversations/${conv.id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchConversations();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConv) return;

    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
      const response = await axios.post(
        `${BACKEND_URL}/chat/conversations/${selectedConv.id}/reply`,
        { message: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedConv(response.data.conversation);
      setReplyText('');
      fetchConversations();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    }
  };

  const deleteConversation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken');
      await axios.delete(`${BACKEND_URL}/chat/conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (selectedConv && selectedConv.id === id) {
        setSelectedConv(null);
      }
      fetchConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="admin-page"><p>Loading...</p></div>;
  }

  return (
    <div className="admin-page" style={{ padding: 0, height: 'calc(100vh - 60px)' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Conversations List */}
        <div style={{
          width: '350px',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}>
            <h2 data-testid="chat-manager-heading" style={{ margin: 0, fontSize: '20px' }}>Conversations</h2>
            {totalUnread > 0 && (
              <span className="admin-badge admin-badge-danger" style={{ marginTop: '8px' }}>
                {totalUnread} unread
              </span>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }} data-testid="conversations-list">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  background: selectedConv?.id === conv.id ? '#f3f4f6' : 'white',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selectedConv?.id === conv.id ? '#f3f4f6' : 'white';
                }}
                data-testid={`conversation-${conv.id}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
                    {conv.customerName}
                  </h4>
                  {conv.unreadCount > 0 && (
                    <span className="admin-badge admin-badge-danger" style={{ fontSize: '11px', padding: '2px 6px' }}>
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#6b7280' }}>
                  {conv.customerEmail}
                </p>
                <p style={{ margin: '4px 0', fontSize: '11px', color: '#9ca3af' }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {formatDate(conv.lastMessageAt)}
                </p>
              </div>
            ))}

            {conversations.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                <MessageCircle size={48} style={{ margin: '0 auto 16px' }} />
                <p>No conversations yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{selectedConv.customerName}</h3>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      <Mail size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {selectedConv.customerEmail}
                    </span>
                    {selectedConv.customerPhone && (
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {selectedConv.customerPhone}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="admin-btn-icon admin-btn-danger"
                  onClick={() => deleteConversation(selectedConv.id)}
                  data-testid="delete-conversation-btn"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }} data-testid="messages-container">
                {selectedConv.messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: msg.sender === 'admin' ? '#a34e1d' : '#f3f4f6',
                      color: msg.sender === 'admin' ? 'white' : '#1f2937'
                    }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>{msg.message}</p>
                      <p style={{
                        margin: '8px 0 0',
                        fontSize: '11px',
                        opacity: 0.7,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {formatDate(msg.timestamp)}
                        {msg.read && msg.sender === 'customer' && <CheckCircle size={12} />}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form
                onSubmit={sendReply}
                style={{
                  padding: '20px',
                  borderTop: '1px solid #e5e7eb',
                  background: 'white'
                }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    data-testid="reply-input"
                  />
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    disabled={!replyText.trim()}
                    data-testid="send-reply-btn"
                  >
                    <Send size={16} /> Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280'
            }}>
              <div style={{ textAlign: 'center' }}>
                <MessageCircle size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p>Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatManager;
