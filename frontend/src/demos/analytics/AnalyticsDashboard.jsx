import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Activity, Users, ShoppingCart, 
  DollarSign, Eye, MousePointer, BarChart3, PieChart, 
  RefreshCw, Download, Play, Pause, Zap, Globe, ShieldCheck, 
  ArrowUpRight, ArrowDownRight, Layers, Sparkles
} from 'lucide-react';
import './analytics.css';

const TIME_RANGES = ['Today (Realtime)', 'Last 7 Days', 'Last 30 Days', 'Quarter-to-Date'];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('Today (Realtime)');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);
  const [activeChartMetric, setActiveChartMetric] = useState('revenue');

  // Dynamic live metric simulation
  const [liveData, setLiveData] = useState({
    activeUsers: 1428,
    pageViews: 12450,
    mrr: 68420,
    bounceRate: 38.4,
    avgSessionTime: '3m 48s',
    conversions: 312
  });

  // Dynamic events stream
  const [eventStream, setEventStream] = useState([
    { id: 1, time: 'Just now', text: 'Enterprise Plan Upgrade ($499/mo)', loc: 'San Francisco, US', tag: 'revenue' },
    { id: 2, time: '14s ago', text: 'Stripe Webhook checkout.session.completed', loc: 'Berlin, DE', tag: 'payment' },
    { id: 3, time: '32s ago', text: 'New Team Member invited (5 seats)', loc: 'London, UK', tag: 'user' },
    { id: 4, time: '1m ago', text: 'API token provisioned for production', loc: 'Tokyo, JP', tag: 'api' },
    { id: 5, time: '2m ago', text: 'Trial converted to Pro Tier ($99/mo)', loc: 'Toronto, CA', tag: 'revenue' }
  ]);

  // Live WebSocket stream simulation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setLiveData(prev => ({
        activeUsers: Math.max(1200, prev.activeUsers + Math.floor(Math.random() * 14 - 6)),
        pageViews: prev.pageViews + Math.floor(Math.random() * 25 + 5),
        mrr: prev.mrr + (Math.random() > 0.7 ? 49 : 0),
        bounceRate: Math.max(28, Math.min(48, prev.bounceRate + (Math.random() * 0.6 - 0.3))),
        avgSessionTime: prev.avgSessionTime,
        conversions: prev.conversions + (Math.random() > 0.75 ? 1 : 0)
      }));

      // Occasionally prepend new activity event
      if (Math.random() > 0.4) {
        const sampleEvents = [
          { text: 'Annual Pro Subscription ($890)', loc: 'New York, US', tag: 'revenue' },
          { text: 'New signup via Google OAuth', loc: 'Paris, FR', tag: 'user' },
          { text: 'High-frequency webhook payload processed', loc: 'Singapore, SG', tag: 'api' },
          { text: 'Exported quarterly CSV analytics', loc: 'Austin, US', tag: 'event' }
        ];
        const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
        setEventStream(prev => [
          { id: Date.now(), time: 'Just now', text: randomEvent.text, loc: randomEvent.loc, tag: randomEvent.tag },
          ...prev.slice(0, 6)
        ]);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Handle manual data refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLiveData(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + 15,
        pageViews: prev.pageViews + 120
      }));
      setRefreshing(false);
    }, 600);
  };

  // CSV Report Generator
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value,Status\n"
      + `Active Concurrent Users,${liveData.activeUsers},Healthy\n`
      + `Daily Page Views,${liveData.pageViews},Growing\n`
      + `Estimated Monthly Recurring Revenue,$${liveData.mrr},On Target\n`
      + `Average Bounce Rate,${liveData.bounceRate.toFixed(1)}%,Optimal\n`
      + `Conversion Rate,3.4%,Strong\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `metechq_analytics_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 2500);
  };

  // Multiplier for timeframe
  const rangeMultiplier = useMemo(() => {
    if (timeRange === 'Today (Realtime)') return 1;
    if (timeRange === 'Last 7 Days') return 6.8;
    if (timeRange === 'Last 30 Days') return 27.5;
    return 84;
  }, [timeRange]);

  return (
    <div className="analytics-dark-theme">

      {/* Dashboard Sticky Controls Bar */}
      <div className="analytics-control-bar">
        <div className="analytics-container control-bar-inner">
          <div className="analytics-title-group">
            <div className="analytics-brand-badge">
              <Activity className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="dash-title-row">
                <h1 className="dash-heading">Production Telemetry & Analytics</h1>
                <div className={`live-stream-badge ${isLiveStreaming ? 'active' : 'paused'}`}>
                  <span className="stream-dot"></span>
                  <span>{isLiveStreaming ? 'LIVE STREAM' : 'STREAM PAUSED'}</span>
                </div>
              </div>
              <p className="dash-subheading">Real-time edge ingestion • Global cluster latency: 18ms</p>
            </div>
          </div>

          <div className="analytics-actions-group">
            {/* Range Pills */}
            <div className="range-pills-selector">
              {TIME_RANGES.map(range => (
                <button
                  key={range}
                  className={`range-pill ${timeRange === range ? 'active' : ''}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Stream Toggle */}
            <button 
              className="stream-toggle-btn"
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              title={isLiveStreaming ? "Pause Live Updates" : "Resume Live Updates"}
            >
              {isLiveStreaming ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            {/* Refresh */}
            <button 
              className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
              onClick={handleRefresh}
              title="Force Sync"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Export CSV */}
            <button className="export-action-btn" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {exportNotice && (
        <div className="export-toast-notice">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Analytics dataset successfully exported as CSV!</span>
        </div>
      )}

      {/* Main Dashboard Canvas */}
      <main className="analytics-canvas">
        <div className="analytics-container">
          
          {/* Key Metric KPI Cards */}
          <div className="kpi-cards-grid">
            {/* KPI 1: Active Users */}
            <div className="kpi-card glow-cyan">
              <div className="kpi-top">
                <span className="kpi-title">Active Concurrent Users</span>
                <span className="kpi-icon-pill bg-cyan">
                  <Users className="h-4 w-4 text-cyan-400" />
                </span>
              </div>
              <div className="kpi-number">{liveData.activeUsers.toLocaleString()}</div>
              <div className="kpi-footer">
                <span className="trend-badge positive">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  +14.2%
                </span>
                <span className="kpi-note">vs last period</span>
              </div>
            </div>

            {/* KPI 2: Page Views */}
            <div className="kpi-card glow-purple">
              <div className="kpi-top">
                <span className="kpi-title">Ingested Page Views</span>
                <span className="kpi-icon-pill bg-purple">
                  <Eye className="h-4 w-4 text-purple-400" />
                </span>
              </div>
              <div className="kpi-number">{Math.round(liveData.pageViews * rangeMultiplier).toLocaleString()}</div>
              <div className="kpi-footer">
                <span className="trend-badge positive">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  +22.8%
                </span>
                <span className="kpi-note">Global edge CDN</span>
              </div>
            </div>

            {/* KPI 3: Recurring Revenue */}
            <div className="kpi-card glow-emerald">
              <div className="kpi-top">
                <span className="kpi-title">Monthly Run-Rate (MRR)</span>
                <span className="kpi-icon-pill bg-emerald">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </span>
              </div>
              <div className="kpi-number">${(liveData.mrr * (rangeMultiplier > 1 ? 1.08 : 1)).toLocaleString()}</div>
              <div className="kpi-footer">
                <span className="trend-badge positive">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  +18.4%
                </span>
                <span className="kpi-note">Net ARR: $820k</span>
              </div>
            </div>

            {/* KPI 4: Conversions */}
            <div className="kpi-card glow-amber">
              <div className="kpi-top">
                <span className="kpi-title">Conversion Rate</span>
                <span className="kpi-icon-pill bg-amber">
                  <ShoppingCart className="h-4 w-4 text-amber-400" />
                </span>
              </div>
              <div className="kpi-number">{liveData.bounceRate > 35 ? '3.42%' : '3.89%'}</div>
              <div className="kpi-footer">
                <span className="trend-badge positive">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  +0.4%
                </span>
                <span className="kpi-note">{Math.round(liveData.conversions * rangeMultiplier)} checked out</span>
              </div>
            </div>
          </div>

          {/* Central Section: Main Interactive Chart & Live Ingestion Stream */}
          <div className="analytics-middle-grid">
            {/* Left: Interactive SVG Area Chart */}
            <div className="panel-card chart-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Throughput & Revenue Velocity</h3>
                  <p className="panel-subtitle">Audited telemetry points aggregated hourly</p>
                </div>
                <div className="chart-metric-selector">
                  <button 
                    className={`chart-tab ${activeChartMetric === 'revenue' ? 'active' : ''}`}
                    onClick={() => setActiveChartMetric('revenue')}
                  >
                    Revenue ($)
                  </button>
                  <button 
                    className={`chart-tab ${activeChartMetric === 'traffic' ? 'active' : ''}`}
                    onClick={() => setActiveChartMetric('traffic')}
                  >
                    Traffic (Views)
                  </button>
                </div>
              </div>

              {/* Dynamic SVG Area Chart */}
              <div className="svg-chart-container">
                <svg viewBox="0 0 700 240" className="analytics-svg-chart">
                  <defs>
                    <linearGradient id="chartGradientCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="chartGradientPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="40" y1="40" x2="680" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="40" y1="90" x2="680" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="40" y1="140" x2="680" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="40" y1="190" x2="680" y2="190" stroke="rgba(255,255,255,0.08)" />

                  {/* Chart Area Fill & Stroke */}
                  {activeChartMetric === 'revenue' ? (
                    <>
                      <path 
                        d="M 40 180 Q 120 160 200 120 T 360 90 T 520 60 T 680 30 L 680 190 L 40 190 Z" 
                        fill="url(#chartGradientCyan)" 
                      />
                      <path 
                        d="M 40 180 Q 120 160 200 120 T 360 90 T 520 60 T 680 30" 
                        fill="none" 
                        stroke="#38bdf8" 
                        strokeWidth="3.5" 
                      />
                      <circle cx="200" cy="120" r="5" fill="#38bdf8" />
                      <circle cx="360" cy="90" r="5" fill="#38bdf8" />
                      <circle cx="520" cy="60" r="5" fill="#38bdf8" />
                      <circle cx="680" cy="30" r="6" fill="#34d399" />
                    </>
                  ) : (
                    <>
                      <path 
                        d="M 40 170 Q 120 130 200 140 T 360 80 T 520 100 T 680 40 L 680 190 L 40 190 Z" 
                        fill="url(#chartGradientPurple)" 
                      />
                      <path 
                        d="M 40 170 Q 120 130 200 140 T 360 80 T 520 100 T 680 40" 
                        fill="none" 
                        stroke="#c084fc" 
                        strokeWidth="3.5" 
                      />
                      <circle cx="200" cy="140" r="5" fill="#c084fc" />
                      <circle cx="360" cy="80" r="5" fill="#c084fc" />
                      <circle cx="520" cy="100" r="5" fill="#c084fc" />
                      <circle cx="680" cy="40" r="6" fill="#38bdf8" />
                    </>
                  )}
                </svg>

                <div className="chart-x-labels">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>Now</span>
                </div>
              </div>
            </div>

            {/* Right: Real-time Incoming Event Feed */}
            <div className="panel-card activity-panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Real-Time Ingestion Log</h3>
                  <p className="panel-subtitle">Live events piped via Kafka broker</p>
                </div>
                <span className="event-count-badge">{eventStream.length} Live</span>
              </div>

              <div className="event-stream-list">
                {eventStream.map(evt => (
                  <div key={evt.id} className="stream-item">
                    <div className={`stream-item-pill ${evt.tag}`}>
                      {evt.tag === 'revenue' && <DollarSign className="h-3.5 w-3.5" />}
                      {evt.tag === 'payment' && <ShieldCheck className="h-3.5 w-3.5" />}
                      {evt.tag === 'user' && <Users className="h-3.5 w-3.5" />}
                      {evt.tag === 'api' && <Zap className="h-3.5 w-3.5" />}
                      {evt.tag === 'event' && <Activity className="h-3.5 w-3.5" />}
                    </div>
                    <div className="stream-item-info">
                      <span className="stream-item-text">{evt.text}</span>
                      <div className="stream-item-meta">
                        <Globe className="h-3 w-3" />
                        <span>{evt.loc}</span>
                      </div>
                    </div>
                    <span className="stream-item-time">{evt.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Grid: Conversion Funnel & Traffic Channels */}
          <div className="analytics-bottom-grid">
            {/* Funnel */}
            <div className="panel-card">
              <h3 className="panel-title mb-4">Customer Acquisition Funnel</h3>
              <div className="funnel-container">
                <div className="funnel-step">
                  <div className="funnel-step-head">
                    <span>1. Unique Site Visitors</span>
                    <strong>100% (45,200)</strong>
                  </div>
                  <div className="funnel-bar-bg">
                    <div className="funnel-bar-fill" style={{ width: '100%', background: '#6366f1' }}></div>
                  </div>
                </div>

                <div className="funnel-step">
                  <div className="funnel-step-head">
                    <span>2. Product & Solution Views</span>
                    <strong>62% (28,024)</strong>
                  </div>
                  <div className="funnel-bar-bg">
                    <div className="funnel-bar-fill" style={{ width: '62%', background: '#3b82f6' }}></div>
                  </div>
                </div>

                <div className="funnel-step">
                  <div className="funnel-step-head">
                    <span>3. In-App Trials & Demos</span>
                    <strong>28% (12,656)</strong>
                  </div>
                  <div className="funnel-bar-bg">
                    <div className="funnel-bar-fill" style={{ width: '28%', background: '#06b6d4' }}></div>
                  </div>
                </div>

                <div className="funnel-step">
                  <div className="funnel-step-head">
                    <span>4. Paid Conversion (Pro / Enterprise)</span>
                    <strong>8.4% (3,796)</strong>
                  </div>
                  <div className="funnel-bar-bg">
                    <div className="funnel-bar-fill" style={{ width: '14%', background: '#10b981' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic Sources & Device Distribution */}
            <div className="panel-card">
              <h3 className="panel-title mb-4">Channel Performance Breakdown</h3>
              <div className="channel-rows">
                {[
                  { name: 'Organic Search (SEO)', pct: 44, color: '#3b82f6', value: '19,880 visits' },
                  { name: 'Direct Access / Bookmarks', pct: 28, color: '#8b5cf6', value: '12,650 visits' },
                  { name: 'Developer Community & GitHub', pct: 18, color: '#10b981', value: '8,136 visits' },
                  { name: 'Partner & Referral Integrations', pct: 10, color: '#f59e0b', value: '4,520 visits' }
                ].map((ch, i) => (
                  <div key={i} className="channel-item">
                    <div className="channel-label-row">
                      <div className="channel-name-dot">
                        <span className="dot-circle" style={{ backgroundColor: ch.color }}></span>
                        <span>{ch.name}</span>
                      </div>
                      <span className="channel-val">{ch.value} ({ch.pct}%)</span>
                    </div>
                    <div className="channel-progress-track">
                      <div 
                        className="channel-progress-fill" 
                        style={{ width: `${ch.pct}%`, backgroundColor: ch.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
