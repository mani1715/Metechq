import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, Palette, Type, Layout, Zap, Grid3x3, 
  Eye, Download, Heart, Activity, Flame, Clock, 
  ChevronRight, Play, Pause, Plus, Check, Trophy, 
  Copy, Sparkles, Moon, Sun, ArrowRight, User
} from 'lucide-react';
import DemoTopNav from '../common/DemoTopNav';
import './mobile-design.css';

const colorPalette = {
  brand: [
    { name: 'FitPulse Red', hex: '#ef4444' },
    { name: 'Hyper Orange', hex: '#f97316' },
    { name: 'Neon Amber', hex: '#f59e0b' },
    { name: 'Bio Emerald', hex: '#10b981' },
    { name: 'Cyan Motion', hex: '#06b6d4' },
    { name: 'Electric Violet', hex: '#8b5cf6' }
  ],
  neutrals: [
    { name: 'Deep Space', hex: '#090d16' },
    { name: 'Onyx Surface', hex: '#111827' },
    { name: 'Charcoal Border', hex: '#1f2937' },
    { name: 'Muted Slate', hex: '#4b5563' },
    { name: 'Ghost Silver', hex: '#9ca3af' },
    { name: 'Pure White', hex: '#ffffff' }
  ]
};

const typographyScale = [
  { level: 'Hero / Display', size: '36px', weight: '800 ExtraBold', useCase: 'Workout summary statistics, countdown timers' },
  { level: 'Title 1', size: '28px', weight: '700 Bold', useCase: 'Primary screen headers, metric totals' },
  { level: 'Title 2', size: '22px', weight: '600 SemiBold', useCase: 'Section titles, exercise card names' },
  { level: 'Body Regular', size: '15px', weight: '400 Regular', useCase: 'Instructional text, descriptions, notifications' },
  { level: 'Caption', size: '12px', weight: '600 SemiBold', useCase: 'Badges, timestamps, secondary labels' }
];

export default function MobileDesignHome() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [phoneScreen, setPhoneScreen] = useState('dashboard');
  const [copiedHex, setCopiedHex] = useState(null);
  
  // Interactive Phone Simulator States
  const [waterCups, setWaterCups] = useState(6);
  const [workoutPlaying, setWorkoutPlaying] = useState(false);
  const [workoutSeconds, setWorkoutSeconds] = useState(842);
  const [activeSegment, setActiveSegment] = useState('Day');
  const [customSampleText, setCustomSampleText] = useState('Break Your Personal Record Today.');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Timer simulation
  useEffect(() => {
    let interval;
    if (workoutPlaying) {
      interval = setInterval(() => {
        setWorkoutSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workoutPlaying]);

  const copyToClipboard = (hex) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleDownloadFigma = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="mobile-design-page">
      <DemoTopNav currentDemoTitle="FitLife Mobile App Design System" portfolioSlug="fitlife-mobile-app-design-system" />

      {/* Hero Header */}
      <header className="mobile-system-hero">
        <div className="system-container">
          <div className="system-hero-badge">
            <Sparkles className="h-4 w-4 text-pink-400" />
            <span>FitLife Design System v3.4 • iOS & Android Tokens</span>
          </div>
          <h1 className="system-hero-title">
            Crafted for Velocity, <br />
            <span className="text-gradient-pink">Engineered for Fitness.</span>
          </h1>
          <p className="system-hero-subtitle">
            A battle-tested mobile design system featuring 120+ atomic components, WCAG AAA accessible high-contrast tokens, 
            and an interactive iPhone 16 Pro real-time prototype.
          </p>

          {/* Navigation Tabs */}
          <div className="system-nav-tabs">
            {[
              { id: 'simulator', label: 'Interactive iPhone Prototype', icon: Smartphone },
              { id: 'colors', label: 'Color Token Palette', icon: Palette },
              { id: 'typography', label: 'Dynamic Typography', icon: Type },
              { id: 'components', label: 'Atomic Components', icon: Layout }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`sys-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <TabIcon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="system-main-content">
        <div className="system-container">

          {/* TAB 1: INTERACTIVE PHONE SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="simulator-section-grid">
              {/* Left Controls & Screen Picker */}
              <div className="simulator-sidebar">
                <div className="sim-panel-box">
                  <h3 className="sim-panel-title">Active Screen Selector</h3>
                  <p className="sim-panel-desc">Click any flow to load it live inside the device frame:</p>
                  
                  <div className="screen-picker-list">
                    {[
                      { id: 'dashboard', name: '1. Activity & Daily Rings', category: 'Home Dashboard', icon: Flame },
                      { id: 'workout', name: '2. Live HIIT Workout Player', category: 'Active Session', icon: Zap },
                      { id: 'nutrition', name: '3. Macro Nutrition Tracker', category: 'Fuel & Diet', icon: Heart },
                      { id: 'social', name: '4. Club Leaderboard', category: 'Community', icon: Trophy }
                    ].map(scr => {
                      const Icon = scr.icon;
                      const isCur = phoneScreen === scr.id;
                      return (
                        <button
                          key={scr.id}
                          className={`screen-item-btn ${isCur ? 'active' : ''}`}
                          onClick={() => setPhoneScreen(scr.id)}
                        >
                          <div className={`scr-icon-pill ${isCur ? 'selected' : ''}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="scr-info">
                            <span className="scr-name">{scr.name}</span>
                            <span className="scr-cat">{scr.category}</span>
                          </div>
                          {isCur && <span className="scr-live-dot"></span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="sim-specs-card">
                    <h4>Component Specs</h4>
                    <ul>
                      <li>Dynamic Island: <strong>Expanded Island API</strong></li>
                      <li>Frame: <strong>Apple iPhone 16 Pro (402 × 874 pt)</strong></li>
                      <li>Haptics: <strong>CoreHaptics Medium Impact</strong></li>
                      <li>Accessibility: <strong>Dynamic Type Ready</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Center: The Realistic iPhone Hardware Frame */}
              <div className="simulator-phone-wrapper">
                <div className="iphone-chassis">
                  {/* Dynamic Island */}
                  <div className="dynamic-island">
                    <div className="island-camera"></div>
                    <div className="island-sensor"></div>
                  </div>

                  {/* Status Bar */}
                  <div className="phone-status-bar">
                    <span className="status-time">9:41</span>
                    <div className="status-icons">
                      <span className="bar-signal">••••</span>
                      <span className="bar-wifi">5G</span>
                      <span className="bar-battery">98%</span>
                    </div>
                  </div>

                  {/* Screen Content Viewport */}
                  <div className="phone-viewport">
                    
                    {/* SCREEN 1: DASHBOARD */}
                    {phoneScreen === 'dashboard' && (
                      <div className="sim-screen-view">
                        <div className="screen-user-header">
                          <div>
                            <span className="greeting-small">Good morning,</span>
                            <h2 className="greeting-name">Alex Rivera</h2>
                          </div>
                          <div className="user-avatar-badge">AR</div>
                        </div>

                        {/* Move / Exercise / Stand Rings Banner */}
                        <div className="phone-rings-card">
                          <div className="rings-visual">
                            <div className="ring-outer">
                              <div className="ring-middle">
                                <div className="ring-inner">
                                  <Flame className="h-5 w-5 text-orange-400" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="rings-metrics">
                            <div className="ring-metric-row">
                              <span className="dot red"></span>
                              <span className="lbl">Move:</span>
                              <strong>640 / 700 kcal</strong>
                            </div>
                            <div className="ring-metric-row">
                              <span className="dot green"></span>
                              <span className="lbl">Exercise:</span>
                              <strong>42 / 30 mins</strong>
                            </div>
                            <div className="ring-metric-row">
                              <span className="dot blue"></span>
                              <span className="lbl">Stand:</span>
                              <strong>11 / 12 hrs</strong>
                            </div>
                          </div>
                        </div>

                        {/* Heart Rate Metric */}
                        <div className="phone-stat-card">
                          <div className="stat-head">
                            <div className="stat-title-group">
                              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                              <span>Resting Heart Rate</span>
                            </div>
                            <span className="stat-badge-good">Optimal</span>
                          </div>
                          <div className="stat-number-row">
                            <span className="big-stat">72</span>
                            <span className="unit">BPM</span>
                          </div>
                          <div className="ecg-wave-sim">
                            <div className="wave-line"></div>
                          </div>
                        </div>

                        {/* Water Tracker with Interactive Tap */}
                        <div className="phone-stat-card">
                          <div className="stat-head">
                            <div className="stat-title-group">
                              <Activity className="h-4 w-4 text-cyan-400" />
                              <span>Daily Hydration</span>
                            </div>
                            <button 
                              className="add-cup-btn"
                              onClick={() => setWaterCups(c => Math.min(12, c + 1))}
                            >
                              <Plus className="h-3 w-3" />
                              Add 250ml
                            </button>
                          </div>
                          <div className="water-level-display">
                            <strong>{(waterCups * 0.25).toFixed(1)}L</strong>
                            <span>/ 3.0L Target ({waterCups} glasses)</span>
                          </div>
                          <div className="water-progress-track">
                            <div 
                              className="water-progress-bar" 
                              style={{ width: `${(waterCups / 12) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SCREEN 2: WORKOUT PLAYER */}
                    {phoneScreen === 'workout' && (
                      <div className="sim-screen-view workout-view">
                        <div className="workout-category-pill">HIIT INTERVAL TRAINING</div>
                        <h2 className="workout-active-title">Full Body Metabolic Burn</h2>
                        <span className="workout-coach">Coach Sarah Jenkins</span>

                        <div className="workout-timer-circle">
                          <div className="timer-display">{formatTimer(workoutSeconds)}</div>
                          <span className="timer-sub">ACTIVE ELAPSED</span>
                        </div>

                        <div className="workout-live-stats">
                          <div className="live-stat-box">
                            <Flame className="h-4 w-4 text-orange-400 mx-auto mb-1" />
                            <strong>342</strong>
                            <small>KCAL</small>
                          </div>
                          <div className="live-stat-box">
                            <Heart className="h-4 w-4 text-red-400 mx-auto mb-1" />
                            <strong>158</strong>
                            <small>BPM (Zone 4)</small>
                          </div>
                          <div className="live-stat-box">
                            <Zap className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                            <strong>85%</strong>
                            <small>INTENSITY</small>
                          </div>
                        </div>

                        <div className="workout-next-card">
                          <span className="next-tag">NEXT SET (IN 15S):</span>
                          <h4>Kettlebell Goblet Squats • 3 × 12 Reps</h4>
                        </div>

                        <button 
                          className={`workout-control-btn ${workoutPlaying ? 'playing' : ''}`}
                          onClick={() => setWorkoutPlaying(!workoutPlaying)}
                        >
                          {workoutPlaying ? (
                            <>
                              <Pause className="h-5 w-5 mr-2" />
                              Pause Interval
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5 mr-2" />
                              Start Interval
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* SCREEN 3: NUTRITION */}
                    {phoneScreen === 'nutrition' && (
                      <div className="sim-screen-view">
                        <h2 className="screen-main-heading">Macro Targets</h2>
                        
                        <div className="macro-breakdown-card">
                          <div className="macro-col">
                            <span className="macro-label">Protein</span>
                            <strong className="macro-val text-red-400">142g</strong>
                            <small>/ 160g</small>
                            <div className="macro-bar"><div style={{ width: '88%', background: '#ef4444' }}></div></div>
                          </div>
                          <div className="macro-col">
                            <span className="macro-label">Carbs</span>
                            <strong className="macro-val text-amber-400">185g</strong>
                            <small>/ 220g</small>
                            <div className="macro-bar"><div style={{ width: '84%', background: '#f59e0b' }}></div></div>
                          </div>
                          <div className="macro-col">
                            <span className="macro-label">Fats</span>
                            <strong className="macro-val text-cyan-400">54g</strong>
                            <small>/ 65g</small>
                            <div className="macro-bar"><div style={{ width: '83%', background: '#06b6d4' }}></div></div>
                          </div>
                        </div>

                        <h3 className="phone-subhead">Logged Meals Today</h3>
                        <div className="meal-log-list">
                          {[
                            { name: 'Oatmeal with Blueberries & Whey', cal: '480 kcal', time: '8:15 AM' },
                            { name: 'Grilled Chicken & Quinoa Bowl', cal: '620 kcal', time: '1:30 PM' },
                            { name: 'Greek Yogurt & Almond Snack', cal: '240 kcal', time: '4:45 PM' }
                          ].map((meal, i) => (
                            <div key={i} className="phone-meal-item">
                              <div>
                                <strong>{meal.name}</strong>
                                <span>{meal.time}</span>
                              </div>
                              <span className="meal-cal-pill">{meal.cal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SCREEN 4: SOCIAL */}
                    {phoneScreen === 'social' && (
                      <div className="sim-screen-view">
                        <div className="social-challenge-banner">
                          <Trophy className="h-6 w-6 text-amber-400" />
                          <div>
                            <h4>March 100k Challenge</h4>
                            <p>Global Club Ranking: Top 5%</p>
                          </div>
                        </div>

                        <h3 className="phone-subhead">Leaderboard (This Week)</h3>
                        <div className="leaderboard-list">
                          {[
                            { rank: '1', name: 'Marcus Chen', steps: '94,210', badge: '🥇' },
                            { rank: '2', name: 'Alex Rivera (You)', steps: '88,450', badge: '🥈', isUser: true },
                            { rank: '3', name: 'Emma Watson', steps: '82,190', badge: '🥉' },
                            { rank: '4', name: 'David Kim', steps: '79,800', badge: '' },
                            { rank: '5', name: 'Sophia Patel', steps: '76,340', badge: '' }
                          ].map(item => (
                            <div key={item.rank} className={`leaderboard-item ${item.isUser ? 'highlight' : ''}`}>
                              <span className="lb-rank">{item.badge || item.rank}</span>
                              <div className="lb-name">
                                <strong>{item.name}</strong>
                                <span>{item.steps} steps</span>
                              </div>
                              <Heart className="h-4 w-4 text-pink-500 fill-pink-500 ml-auto" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Home Indicator */}
                  <div className="iphone-home-indicator"></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLOR TOKENS */}
          {activeTab === 'colors' && (
            <div className="system-tab-content">
              <div className="tab-header-row">
                <div>
                  <h2 className="tab-heading">Color Tokens & Accessibility Hierarchy</h2>
                  <p className="tab-sub">Click any color card to copy the hex code directly to your clipboard:</p>
                </div>
                {copiedHex && (
                  <div className="copied-pill">
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied {copiedHex}!</span>
                  </div>
                )}
              </div>

              <h3 className="color-group-title">Brand Accents & High-Intensity Tokens</h3>
              <div className="color-swatches-grid">
                {colorPalette.brand.map(col => (
                  <div 
                    key={col.hex} 
                    className="swatch-card"
                    onClick={() => copyToClipboard(col.hex)}
                  >
                    <div className="swatch-color-box" style={{ backgroundColor: col.hex }}>
                      <Copy className="h-4 w-4 swatch-copy-icon" />
                    </div>
                    <div className="swatch-meta">
                      <strong>{col.name}</strong>
                      <code>{col.hex}</code>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="color-group-title mt-8">Dark Mode Surfaces & Neutral Tokens</h3>
              <div className="color-swatches-grid">
                {colorPalette.neutrals.map(col => (
                  <div 
                    key={col.hex} 
                    className="swatch-card"
                    onClick={() => copyToClipboard(col.hex)}
                  >
                    <div className="swatch-color-box" style={{ backgroundColor: col.hex }}>
                      <Copy className="h-4 w-4 swatch-copy-icon" />
                    </div>
                    <div className="swatch-meta">
                      <strong>{col.name}</strong>
                      <code>{col.hex}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="system-tab-content">
              <h2 className="tab-heading">Modular Typography System</h2>
              <p className="tab-sub">Type custom text below to see live scale rendering:</p>

              <div className="type-test-input-box">
                <label>Interactive Preview Phrase:</label>
                <input 
                  type="text" 
                  value={customSampleText}
                  onChange={(e) => setCustomSampleText(e.target.value)}
                  className="type-input"
                />
              </div>

              <div className="type-scale-table">
                {typographyScale.map((t, idx) => (
                  <div key={idx} className="type-row">
                    <div className="type-meta-col">
                      <strong>{t.level}</strong>
                      <span>{t.size} • {t.weight}</span>
                      <small>{t.useCase}</small>
                    </div>
                    <div className="type-preview-col" style={{ fontSize: t.size }}>
                      {customSampleText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMPONENTS */}
          {activeTab === 'components' && (
            <div className="system-tab-content">
              <h2 className="tab-heading">Interactive Atomic Components</h2>
              <p className="tab-sub">Explore production ready micro-interactions built with Tailwind & React:</p>

              <div className="components-interactive-grid">
                {/* Buttons Sandbox */}
                <div className="component-box">
                  <h4>Button Variants</h4>
                  <div className="comp-row">
                    <button className="fit-btn fit-btn-primary">Primary Pill</button>
                    <button className="fit-btn fit-btn-secondary">Secondary Dark</button>
                    <button className="fit-btn fit-btn-outline">Outline Stroke</button>
                  </div>
                </div>

                {/* Segmented Controls */}
                <div className="component-box">
                  <h4>Segmented Control</h4>
                  <div className="fit-segmented">
                    {['Day', 'Week', 'Month', 'Year'].map(seg => (
                      <button 
                        key={seg} 
                        className={`seg-btn ${activeSegment === seg ? 'active' : ''}`}
                        onClick={() => setActiveSegment(seg)}
                      >
                        {seg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badge Chips */}
                <div className="component-box">
                  <h4>Metric Badges</h4>
                  <div className="comp-row">
                    <span className="fit-badge badge-red">
                      <Flame className="h-3 w-3 mr-1" />
                      HIIT Mode
                    </span>
                    <span className="fit-badge badge-green">
                      <Check className="h-3 w-3 mr-1" />
                      Target Achieved
                    </span>
                    <span className="fit-badge badge-cyan">
                      <Heart className="h-3 w-3 mr-1" />
                      142 BPM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Asset Exporter CTA */}
      <footer className="system-footer-banner">
        <div className="system-container footer-banner-inner">
          <div>
            <h3 className="footer-title">Ready to implement in React Native or iOS?</h3>
            <p className="footer-sub">Download complete token definition file (.json) and Figma UI Kit.</p>
          </div>
          <button className="download-kit-btn" onClick={handleDownloadFigma}>
            <Download className="h-4 w-4 mr-2" />
            <span>{downloadSuccess ? 'Design Tokens Saved!' : 'Export Tokens (.JSON)'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
