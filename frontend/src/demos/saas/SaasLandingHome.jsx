import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, ArrowRight, Sparkles, Zap, Shield, 
  Users, BarChart3, Layers, Plus, ChevronDown, 
  ChevronUp, CheckCircle2, Play, Star, Rocket
} from 'lucide-react';
import DemoTopNav from '../common/DemoTopNav';
import './saas.css';

const initialTasks = {
  backlog: [
    { id: 'task-1', title: 'Implement OAuth 2.0 PKCE Flow', tag: 'Security', priority: 'High', points: 5 },
    { id: 'task-2', title: 'Optimize PostgreSQL connection pooling', tag: 'Database', priority: 'Medium', points: 3 }
  ],
  inProgress: [
    { id: 'task-3', title: 'Design System Dark Mode Tokens v2', tag: 'Design', priority: 'High', points: 8 },
    { id: 'task-4', title: 'Real-time WebSocket synchronization', tag: 'Backend', priority: 'Critical', points: 13 }
  ],
  review: [
    { id: 'task-5', title: 'Stripe webhook retry & idempotency', tag: 'Payments', priority: 'High', points: 5 }
  ],
  done: [
    { id: 'task-6', title: 'Setup automated GitHub Actions CI', tag: 'DevOps', priority: 'Low', points: 2 },
    { id: 'task-7', title: 'Vercel Preview Deployment edge routing', tag: 'Infra', priority: 'Medium', points: 3 }
  ]
};

const faqs = [
  {
    q: 'How does TaskFlow compare to Jira or Linear?',
    a: 'TaskFlow is designed from the ground up for high-velocity software teams who value keyboard shortcuts, sub-50ms interaction latency, and built-in AI automated task sizing without bloated configuration screens.'
  },
  {
    q: 'Can we integrate TaskFlow with GitHub and GitLab?',
    a: 'Yes! TaskFlow provides bi-directional pull request tracking, branch auto-linking, and automated issue transition when pull requests are merged.'
  },
  {
    q: 'What is included in the 14-day Enterprise Trial?',
    a: 'Unlimited team members, SOC 2 compliance reports, dedicated Slack/Teams connect channels, and full access to our automated sprint planning engine.'
  },
  {
    q: 'Is there an on-premise or self-hosted deployment option?',
    a: 'Yes, our Enterprise plan supports Kubernetes Helm charts for deployment into private VPCs on AWS, GCP, or Azure.'
  }
];

export default function SaasLandingHome() {
  const [tasks, setTasks] = useState(initialTasks);
  const [billingCycle, setBillingCycle] = useState('annual');
  const [teamSeats, setTeamSeats] = useState(12);
  const [openFaq, setOpenFaq] = useState(0);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [trialCreated, setTrialCreated] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('Acme Corp');

  // Move task to next column in simulator
  const moveTaskForward = (taskId, currentCol) => {
    const colOrder = ['backlog', 'inProgress', 'review', 'done'];
    const curIdx = colOrder.indexOf(currentCol);
    if (curIdx === -1 || curIdx === colOrder.length - 1) return;

    const nextCol = colOrder[curIdx + 1];
    const task = tasks[currentCol].find(t => t.id === taskId);
    if (!task) return;

    setTasks(prev => ({
      ...prev,
      [currentCol]: prev[currentCol].filter(t => t.id !== taskId),
      [nextCol]: [task, ...prev[nextCol]]
    }));
  };

  // Pricing calculations
  const perUserRate = billingCycle === 'annual' ? 16 : 20;
  const totalPrice = teamSeats * perUserRate;

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    setTrialCreated(true);
  };

  return (
    <div className="saas-demo-page">
      <DemoTopNav currentDemoTitle="TaskFlow Pro - SaaS Landing Page" portfolioSlug="taskflow-pro-saas-landing-page" />

      {/* Hero Section */}
      <section className="saas-hero-modern">
        <div className="saas-container">
          <div className="saas-hero-badge">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>TaskFlow Pro 4.0 • Autonomous Sprint Orchestration</span>
          </div>

          <h1 className="saas-hero-headline">
            Project Management <br />
            <span className="text-gradient-cyan">Built for Engineering Speed.</span>
          </h1>

          <p className="saas-hero-subheadline">
            Eliminate standup overhead. TaskFlow connects your code repositories, design tokens, and roadmap 
            into a sub-50ms synchronized workspace.
          </p>

          <div className="saas-hero-cta-row">
            <button 
              className="saas-btn-glow"
              onClick={() => {
                setTrialModalOpen(true);
                setTrialCreated(false);
              }}
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#simulator" className="saas-btn-glass">
              <Play className="h-4 w-4 fill-white" />
              <span>Test Drive Interactive Board</span>
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="saas-proof-row">
            <div className="proof-rating">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span>4.9 / 5 on G2 & ProductHunt</span>
            </div>
            <div className="proof-divider"></div>
            <span>Powering 40,000+ developers at high-growth teams</span>
          </div>
        </div>
      </section>

      {/* Interactive Kanban Board Simulator */}
      <section id="simulator" className="saas-section simulator-section">
        <div className="saas-container">
          <div className="saas-section-header text-center">
            <div className="saas-pretitle">INTERACTIVE WORKSPACE DEMO</div>
            <h2 className="saas-maintitle">Sprint Kanban That Feels Instant</h2>
            <p className="saas-intro">
              Click the <ArrowRight className="h-3.5 w-3.5 inline mx-1 text-cyan-400" /> button on any card below to progress tasks in real-time across sprint stages:
            </p>
          </div>

          <div className="kanban-board-frame">
            <div className="kanban-header-bar">
              <div className="board-name">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Sprint 24: Core Infrastructure Delivery</span>
              </div>
              <div className="board-pills">
                <span className="sprint-status-tag">Active Sprint (Day 8 of 14)</span>
                <span className="points-badge">39 Story Points</span>
              </div>
            </div>

            <div className="kanban-columns-grid">
              {/* Backlog */}
              <div className="kanban-column">
                <div className="col-header">
                  <span className="col-title">Backlog</span>
                  <span className="col-count">{tasks.backlog.length}</span>
                </div>
                <div className="col-cards-list">
                  {tasks.backlog.map(task => (
                    <div key={task.id} className="kanban-task-card">
                      <div className="task-top">
                        <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                        <span className="pts">{task.points} pts</span>
                      </div>
                      <h4 className="task-name">{task.title}</h4>
                      <div className="task-foot">
                        <span className="tag-pill">{task.tag}</span>
                        <button 
                          className="move-card-btn" 
                          title="Move to In Progress"
                          onClick={() => moveTaskForward(task.id, 'backlog')}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* In Progress */}
              <div className="kanban-column">
                <div className="col-header">
                  <span className="col-title">In Progress</span>
                  <span className="col-count">{tasks.inProgress.length}</span>
                </div>
                <div className="col-cards-list">
                  {tasks.inProgress.map(task => (
                    <div key={task.id} className="kanban-task-card active-card">
                      <div className="task-top">
                        <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                        <span className="pts">{task.points} pts</span>
                      </div>
                      <h4 className="task-name">{task.title}</h4>
                      <div className="task-foot">
                        <span className="tag-pill">{task.tag}</span>
                        <button 
                          className="move-card-btn" 
                          title="Move to Code Review"
                          onClick={() => moveTaskForward(task.id, 'inProgress')}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Review */}
              <div className="kanban-column">
                <div className="col-header">
                  <span className="col-title">Code Review</span>
                  <span className="col-count">{tasks.review.length}</span>
                </div>
                <div className="col-cards-list">
                  {tasks.review.map(task => (
                    <div key={task.id} className="kanban-task-card">
                      <div className="task-top">
                        <span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span>
                        <span className="pts">{task.points} pts</span>
                      </div>
                      <h4 className="task-name">{task.title}</h4>
                      <div className="task-foot">
                        <span className="tag-pill">{task.tag}</span>
                        <button 
                          className="move-card-btn" 
                          title="Mark as Done"
                          onClick={() => moveTaskForward(task.id, 'review')}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Done */}
              <div className="kanban-column">
                <div className="col-header">
                  <span className="col-title">Done</span>
                  <span className="col-count">{tasks.done.length}</span>
                </div>
                <div className="col-cards-list">
                  {tasks.done.map(task => (
                    <div key={task.id} className="kanban-task-card completed-card">
                      <div className="task-top">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="pts">{task.points} pts</span>
                      </div>
                      <h4 className="task-name line-through text-gray-400">{task.title}</h4>
                      <div className="task-foot">
                        <span className="tag-pill">{task.tag}</span>
                        <span className="shipped-badge">Shipped</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Interactive Pricing Calculator */}
      <section className="saas-section pricing-section">
        <div className="saas-container">
          <div className="saas-section-header text-center">
            <div className="saas-pretitle">TRANSPARENT VALUE</div>
            <h2 className="saas-maintitle">Predictable Pricing for High-Growth Teams</h2>
            
            {/* Billing Switcher */}
            <div className="billing-switcher-container">
              <span className={billingCycle === 'monthly' ? 'active-label' : ''}>Monthly</span>
              <button 
                className="billing-toggle-pill"
                onClick={() => setBillingCycle(b => b === 'monthly' ? 'annual' : 'monthly')}
              >
                <div className={`pill-thumb ${billingCycle === 'annual' ? 'annual' : 'monthly'}`}></div>
              </button>
              <span className={billingCycle === 'annual' ? 'active-label' : ''}>
                Annual <span className="discount-tag">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="pricing-calculator-card">
            <div className="pricing-grid">
              <div className="pricing-slider-side">
                <h3>Select Your Team Size</h3>
                <div className="seats-display">
                  <strong>{teamSeats}</strong>
                  <span>Engineers / Contributors</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="50" 
                  value={teamSeats}
                  onChange={(e) => setTeamSeats(Number(e.target.value))}
                  className="seats-slider"
                />
                <div className="slider-labels">
                  <span>2 seats</span>
                  <span>25 seats</span>
                  <span>50+ seats</span>
                </div>

                <div className="plan-perks-list">
                  <div className="perk-item">
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>Unlimited boards, epics & document roadmaps</span>
                  </div>
                  <div className="perk-item">
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>Real-time GitHub & GitLab bi-directional sync</span>
                  </div>
                  <div className="perk-item">
                    <Check className="h-4 w-4 text-cyan-400" />
                    <span>Single Sign-On (Google Workspace, Okta & SAML)</span>
                  </div>
                </div>
              </div>

              <div className="pricing-summary-side">
                <span className="price-plan-badge">TASKFLOW PRO TIER</span>
                <div className="price-big-number">
                  ${totalPrice}
                  <small>/ month</small>
                </div>
                <span className="price-billed-info">
                  ${perUserRate}/user/mo • Billed {billingCycle}
                </span>

                <button 
                  className="start-plan-btn"
                  onClick={() => {
                    setTrialModalOpen(true);
                    setTrialCreated(false);
                  }}
                >
                  Start 14-Day Free Trial
                </button>
                <span className="no-cc-note">No credit card required • Instant setup in 60s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="saas-section faq-section">
        <div className="saas-container">
          <div className="saas-section-header text-center">
            <div className="saas-pretitle">FREQUENTLY ASKED QUESTIONS</div>
            <h2 className="saas-maintitle">Everything You Need to Know</h2>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq-card ${isOpen ? 'open' : ''}`}>
                  <button 
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span>{f.q}</span>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-cyan-400" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{f.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instant Trial Modal */}
      {trialModalOpen && (
        <div className="saas-modal-backdrop">
          <div className="saas-modal-window">
            <button className="modal-close" onClick={() => setTrialModalOpen(false)}>×</button>
            {trialCreated ? (
              <div className="text-center py-4">
                <div className="trial-success-ring">
                  <Rocket className="h-8 w-8 text-cyan-400" />
                </div>
                <h3>Workspace Ready!</h3>
                <p>
                  <strong>https://taskflow.io/{workspaceName.toLowerCase().replace(/\s+/g, '-')}-workspace</strong> has been created with {teamSeats} seats.
                </p>
                <button className="start-plan-btn mt-4" onClick={() => setTrialModalOpen(false)}>
                  Enter Workspace
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateWorkspace}>
                <h3 className="modal-heading">Launch Your TaskFlow Workspace</h3>
                <p className="modal-subheading">Get immediate access with all Pro features unlocked.</p>

                <div className="saas-form-field">
                  <label>Company / Workspace Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="saas-input"
                  />
                </div>

                <div className="saas-form-field">
                  <label>Work Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="alex@acmecorp.com"
                    className="saas-input"
                  />
                </div>

                <button type="submit" className="start-plan-btn mt-2">
                  Deploy Free Workspace Now
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
