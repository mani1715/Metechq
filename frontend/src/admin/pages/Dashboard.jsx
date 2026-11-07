import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Mail,
  Wrench,
  TrendingUp,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Dashboard = () => {
  const { adminData } = useAdmin();

  const stats = [
    {
      icon: Briefcase,
      value: adminData.projects.length,
      label: 'Total Projects',
      color: 'purple',
      change: '+12%',
      link: '/admin/portfolio'
    },
    {
      icon: Mail,
      value: adminData.contacts.filter(c => c.status === 'unread').length,
      label: 'New Contacts',
      color: 'gold',
      change: '+5',
      link: '/admin/contacts'
    },
    {
      icon: Wrench,
      value: adminData.services.length,
      label: 'Active Services',
      color: 'navy',
      change: 'All active',
      link: '/admin/services'
    },
    {
      icon: TrendingUp,
      value: '98%',
      label: 'Client Satisfaction',
      color: 'purple',
      change: '+3%',
      link: '/admin/settings'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'contact',
      message: 'New contact submission from John Smith',
      time: '2 hours ago',
      icon: Mail
    },
    {
      id: 2,
      type: 'project',
      message: 'Portfolio project "StyleHub Fashion Store" updated',
      time: '5 hours ago',
      icon: Briefcase
    },
    {
      id: 3,
      type: 'service',
      message: 'Service "E-commerce Solutions" details modified',
      time: '1 day ago',
      icon: Wrench
    }
  ];

  const quickActions = [
    {
      title: 'Add New Project',
      description: 'Showcase your latest work',
      link: '/admin/portfolio',
      icon: Briefcase,
      color: 'purple'
    },
    {
      title: 'Edit Home Page',
      description: 'Update hero section and content',
      link: '/admin/pages',
      icon: Eye,
      color: 'gold'
    },
    {
      title: 'View Contacts',
      description: 'Check new inquiries',
      link: '/admin/contacts',
      icon: Mail,
      color: 'navy'
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#352a21',
          margin: '0 0 8px 0'
        }}>Dashboard</h1>
        <p style={{
          color: '#6B7280',
          margin: 0
        }}>Welcome back, {adminData?.settings?.agency?.owner || 'Admin'}! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-dashboard-grid">
        {stats.map((stat, index) => (
          <div key={index} className="admin-stat-card">
            <div className="admin-stat-header">
              <div className={`admin-stat-icon ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span style={{
                fontSize: '12px',
                color: '#10B981',
                fontWeight: '600'
              }}>{stat.change}</span>
            </div>
            <h3 className="admin-stat-value">{stat.value}</h3>
            <p className="admin-stat-label">{stat.label}</p>
            <Link to={stat.link} style={{
              fontSize: '14px',
              color: '#a34e1d',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '12px'
            }}>
              View details <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginTop: '32px'
      }}>
        {/* Recent Activity */}
        <div className="admin-table">
          <div className="admin-table-header">
            <h3 className="admin-table-title">Recent Activity</h3>
          </div>
          <div style={{ padding: '0' }}>
            {recentActivities.map((activity) => (
              <div key={activity.id} style={{
                padding: '16px 24px',
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                gap: '16px',
                alignItems: 'start'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'rgba(163, 78, 29, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <activity.icon size={20} color="#a34e1d" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    color: '#374151'
                  }}>{activity.message}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={12} /> {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-table">
          <div className="admin-table-header">
            <h3 className="admin-table-title">Quick Actions</h3>
          </div>
          <div style={{ padding: '16px' }}>
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  textDecoration: 'none',
                  marginBottom: index < quickActions.length - 1 ? '12px' : 0,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#a34e1d';
                  e.currentTarget.style.background = 'rgba(163, 78, 29, 0.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: action.color === 'purple' ? 'rgba(163, 78, 29, 0.1)' :
                            action.color === 'gold' ? 'rgba(212, 175, 55, 0.1)' :
                            'rgba(28, 42, 58, 0.1)',
                  color: action.color === 'purple' ? '#a34e1d' :
                        action.color === 'gold' ? '#c5792c' : '#352a21',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <action.icon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: '0 0 4px 0',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#352a21'
                  }}>{action.title}</h4>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#6B7280'
                  }}>{action.description}</p>
                </div>
                <ArrowRight size={20} color="#9CA3AF" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
