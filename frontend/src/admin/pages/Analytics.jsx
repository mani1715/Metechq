import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Calculator,
  Eye,
  FileText,
  RefreshCw,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { getAnalyticsSummary } from '../../services/analytics';
import { toast } from 'sonner';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7days');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const data = await getAnalyticsSummary(period, token);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
    toast.success('Analytics refreshed');
  };

  const getPeriodLabel = () => {
    switch(period) {
      case 'today': return 'Today';
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      default: return 'Last 7 Days';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-600"></div>
          <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-4 border-brand-400 opacity-20"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6" data-testid="analytics-dashboard" style={{
      background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)',
      minHeight: '100vh',
      margin: '-24px',
      padding: '32px'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 shadow-2xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white drop-shadow-lg" data-testid="analytics-title">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-white/90 font-medium ml-14">Track website activity and visitor engagement</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 shadow-xl transition-all duration-300 hover:scale-105"
          data-testid="refresh-analytics-btn"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-3 backdrop-blur-lg bg-white/10 p-4 rounded-2xl border border-white/20" data-testid="period-selector">
        <div className="flex items-center gap-2 mr-3">
          <Activity className="h-5 w-5 text-white" />
          <span className="text-white font-semibold">Time Period:</span>
        </div>
        <Button
          onClick={() => setPeriod('today')}
          className={period === 'today'
            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/50 hover:shadow-xl hover:shadow-pink-500/60 border-0'
            : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/30'
          }
          size="sm"
          data-testid="period-today-btn"
        >
          Today
        </Button>
        <Button
          onClick={() => setPeriod('7days')}
          className={period === '7days'
            ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-white shadow-lg shadow-brand-500/50 hover:shadow-xl hover:shadow-brand-500/60 border-0'
            : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/30'
          }
          size="sm"
          data-testid="period-7days-btn"
        >
          Last 7 Days
        </Button>
        <Button
          onClick={() => setPeriod('30days')}
          className={period === '30days'
            ? 'bg-gradient-to-r from-brand-500 to-brand-500 text-white shadow-lg shadow-brand-500/50 hover:shadow-xl hover:shadow-brand-500/60 border-0'
            : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/30'
          }
          size="sm"
          data-testid="period-30days-btn"
        >
          Last 30 Days
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Page Views */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group"
          style={{
            background: 'linear-gradient(135deg, #5b4632 0%, #a34e1d 100%)'
          }}
          data-testid="stat-page-views"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <Zap className="h-5 w-5 text-yellow-300 animate-pulse" />
            </div>
            <h3 className="text-4xl font-black text-white mb-2">
              {analyticsData?.total_page_views || 0}
            </h3>
            <p className="text-white/90 text-sm font-semibold mb-3">Total Page Views</p>
            <div className="flex items-center text-sm font-medium px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit">
              <TrendingUp className="h-4 w-4 mr-1 text-green-300" />
              <span className="text-white">{getPeriodLabel()}</span>
            </div>
          </div>
        </div>

        {/* Contact Submissions */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group"
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          }}
          data-testid="stat-contact-submissions"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <Sparkles className="h-5 w-5 text-yellow-200 animate-pulse" />
            </div>
            <h3 className="text-4xl font-black text-white mb-2">
              {analyticsData?.contact_submissions || 0}
            </h3>
            <p className="text-white/90 text-sm font-semibold mb-3">Contact Submissions</p>
            <div className="flex items-center text-sm font-medium px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit">
              <TrendingUp className="h-4 w-4 mr-1 text-green-300" />
              <span className="text-white">{getPeriodLabel()}</span>
            </div>
          </div>
        </div>

        {/* Calculator Usage */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group"
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          }}
          data-testid="stat-calculator-usage"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Calculator className="h-7 w-7 text-white" />
              </div>
              <Activity className="h-5 w-5 text-cyan-200 animate-pulse" />
            </div>
            <h3 className="text-4xl font-black text-white mb-2">
              {analyticsData?.calculator_opened || 0}
            </h3>
            <p className="text-white/90 text-sm font-semibold mb-3">Calculator Opens</p>
            <div className="text-sm font-medium px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit">
              <span className="text-white">{analyticsData?.calculator_estimates || 0} estimates generated</span>
            </div>
          </div>
        </div>

        {/* Blog Engagement */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group"
          style={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
          }}
          data-testid="stat-blog-views"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <Sparkles className="h-5 w-5 text-orange-200 animate-pulse" />
            </div>
            <h3 className="text-4xl font-black text-white mb-2">
              {analyticsData?.blog_views?.reduce((sum, blog) => sum + blog.count, 0) || 0}
            </h3>
            <p className="text-white/90 text-sm font-semibold mb-3">Total Blog Views</p>
            <div className="flex items-center text-sm font-medium px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit">
              <TrendingUp className="h-4 w-4 mr-1 text-green-300" />
              <span className="text-white">{getPeriodLabel()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Views Breakdown */}
      <div
        className="backdrop-blur-lg bg-white/95 p-8 rounded-2xl border border-white/20 shadow-2xl"
        data-testid="page-views-breakdown"
      >
        <h2 className="text-2xl font-black mb-6 flex items-center bg-gradient-to-r from-brand-600 to-brand-600 bg-clip-text text-transparent">
          <BarChart3 className="h-6 w-6 mr-3 text-brand-600" />
          Page Views by Page
        </h2>
        {analyticsData?.page_views_by_page && analyticsData.page_views_by_page.length > 0 ? (
          <div className="space-y-4">
            {analyticsData.page_views_by_page.map((page, index) => {
              const colors = [
                { bg: 'from-pink-500 to-rose-500', badge: 'bg-gradient-to-r from-pink-500 to-rose-500' },
                { bg: 'from-brand-500 to-brand-500', badge: 'bg-gradient-to-r from-brand-500 to-brand-500' },
                { bg: 'from-brand-500 to-cyan-500', badge: 'bg-gradient-to-r from-brand-500 to-cyan-500' },
                { bg: 'from-green-500 to-emerald-500', badge: 'bg-gradient-to-r from-green-500 to-emerald-500' },
                { bg: 'from-orange-500 to-amber-500', badge: 'bg-gradient-to-r from-orange-500 to-amber-500' },
                { bg: 'from-red-500 to-pink-500', badge: 'bg-gradient-to-r from-red-500 to-pink-500' },
              ];
              const colorScheme = colors[index % colors.length];

              return (
                <div key={index} className="group hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 bg-gradient-to-br ${colorScheme.bg} rounded-xl shadow-lg flex items-center justify-center text-white font-black text-lg group-hover:scale-110 transition-transform`}>
                        {index + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 capitalize text-lg">
                          {page.page_name}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {((page.count / analyticsData.total_page_views) * 100).toFixed(1)}% of total views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex-1 max-w-xs min-w-[200px]">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full bg-gradient-to-r ${colorScheme.bg} rounded-full shadow-lg transition-all duration-1000 ease-out`}
                            style={{
                              width: `${(page.count / analyticsData.total_page_views) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className={`${colorScheme.badge} text-white px-4 py-2 rounded-lg shadow-lg font-black text-lg min-w-[70px] text-center`}>
                        {page.count}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No page view data available for this period</p>
          </div>
        )}
      </div>

      {/* Most Viewed Blogs */}
      {analyticsData?.blog_views && analyticsData.blog_views.length > 0 && (
        <div
          className="backdrop-blur-lg bg-white/95 p-8 rounded-2xl border border-white/20 shadow-2xl"
          data-testid="most-viewed-blogs"
        >
          <h2 className="text-2xl font-black mb-6 flex items-center bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            <FileText className="h-6 w-6 mr-3 text-orange-600" />
            Most Viewed Blog Posts
          </h2>
          <div className="space-y-4">
            {analyticsData.blog_views.slice(0, 5).map((blog, index) => {
              const blogColors = [
                'from-red-500 to-pink-500',
                'from-brand-500 to-pink-500',
                'from-brand-500 to-brand-500',
                'from-cyan-500 to-brand-500',
                'from-green-500 to-cyan-500',
              ];
              const gradient = blogColors[index % blogColors.length];

              return (
                <div key={blog.blog_id} className="group hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-lg hover:shadow-xl border border-gray-100">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl shadow-lg flex items-center justify-center text-white font-black text-lg group-hover:scale-110 transition-transform group-hover:rotate-12`}>
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-orange-500" />
                        <span className="font-bold text-gray-900 text-lg">
                          {blog.blog_title}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-gray-400" />
                      <span className={`bg-gradient-to-r ${gradient} text-white px-5 py-2 rounded-lg shadow-lg font-black text-lg`}>
                        {blog.count}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div
        className="backdrop-blur-lg bg-gradient-to-r from-brand-500/90 to-brand-500/90 p-6 rounded-2xl border border-white/30 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-black text-white text-xl mb-2 flex items-center gap-2">
              Privacy-First Analytics
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </h3>
            <p className="text-white/90 font-medium leading-relaxed">
              We track only basic usage metrics (page views, form submissions) without collecting any personal data, IP addresses, or user identifiers. All tracking is anonymous and privacy-focused.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
