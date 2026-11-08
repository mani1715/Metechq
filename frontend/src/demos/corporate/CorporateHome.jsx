import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Cloud, Shield, Database, Smartphone, 
  Cpu, Users, Briefcase, Globe, Star, Award, 
  CheckCircle2, TrendingUp, Sparkles, Send, Check,
  BarChart, Layers, Lock, Zap
} from 'lucide-react';
import CorporateNav from './CorporateNav';
import './corporate.css';
import {
  corporateInfo,
  corporateServices,
  corporateStats,
  corporateTeam,
  corporateTestimonials,
  corporateCaseStudies,
  corporateClients
} from '../../data/corporateData';

const solutionTabs = [
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    icon: Cloud,
    tagline: 'Multi-Cloud Architecture & Kubernetes Orchestration',
    description: 'Transform legacy workloads into scalable, fault-tolerant microservices running on AWS, Azure, and Google Cloud with 99.999% uptime guarantees.',
    deliverables: ['Zero-downtime migration pipelines', 'Automated Infrastructure as Code (Terraform)', 'FinOps cloud cost reduction (avg. 34%)', '24/7 SRE monitoring & automated failover']
  },
  {
    id: 'ai',
    label: 'AI & Data Platforms',
    icon: Cpu,
    tagline: 'Predictive Intelligence & Large Language Model Fine-Tuning',
    description: 'Harness enterprise proprietary knowledge bases with private, compliance-ready RAG architectures and custom automated agent workflows.',
    deliverables: ['Custom domain-specific LLM fine-tuning', 'Vector database ingestion pipelines', 'Real-time telemetry & feature store pipelines', 'Enterprise compliance & data privacy guardrails']
  },
  {
    id: 'security',
    label: 'Zero-Trust Cybersecurity',
    icon: Shield,
    tagline: 'End-to-End Enterprise Defense & Threat Intelligence',
    description: 'Defend distributed corporate infrastructure against modern cyber adversaries with continuous authentication and automated remediation.',
    deliverables: ['SOC 2 Type II & ISO 27001 readiness audits', 'Zero-trust perimeter network segmentation', 'Continuous vulnerability scanning & pen testing', 'Automated incident response playbooks']
  },
  {
    id: 'enterprise',
    label: 'Enterprise Modernization',
    icon: Database,
    tagline: 'ERP, CRM & High-Throughput API Gateway Integration',
    description: 'Bridge legacy on-prem core systems with high-velocity modern web and mobile applications through clean, secured REST and GraphQL interfaces.',
    deliverables: ['High-throughput message brokers (Kafka/RabbitMQ)', 'Unified single sign-on (Okta / Azure AD / SAML)', 'Bi-directional Salesforce & SAP data sync', 'Micro-frontend architecture adoption']
  }
];

const CorporateHome = () => {
  const [activeSolution, setActiveSolution] = useState(solutionTabs[0]);
  
  // Interactive ROI Calculator State
  const [teamSize, setTeamSize] = useState(150);
  const [cloudSpend, setCloudSpend] = useState(350000);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Cloud Modernization',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Estimated ROI Calculations
  const estimatedSavings = Math.round(cloudSpend * 0.32);
  const hoursSavedPerYear = Math.round(teamSize * 140);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="corporate-demo">
      <CorporateNav />

      {/* Hero Section */}
      <section className="corp-hero-elite">
        <div className="corp-hero-ambient">
          <div className="ambient-glow glow-1"></div>
          <div className="ambient-glow glow-2"></div>
        </div>

        <div className="container corp-hero-inner">
          <div className="corp-hero-content">
            <div className="corp-tag-badge">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Enterprise Technology & Strategy Consulting</span>
            </div>

            <h1 className="corp-headline">
              Engineering the <br />
              <span className="corp-gradient-text">Digital Backbone</span> <br />
              of Global Industry.
            </h1>

            <p className="corp-subheadline">
              {corporateInfo.description || "TechVentures delivers mission-critical cloud architecture, enterprise AI transformation, and zero-trust cybersecurity for Fortune 500 leaders worldwide."}
            </p>

            <div className="corp-cta-row">
              <a href="#consultation" className="corp-btn-glow">
                <span>Request Executive Briefing</span>
                <ArrowRight size={18} />
              </a>
              <a href="#roi-calculator" className="corp-btn-glass">
                <span>Explore ROI Model</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="corp-metrics-bar">
              <div className="corp-metric-item">
                <span className="metric-number">99.999%</span>
                <span className="metric-title">SLA Reliability</span>
              </div>
              <div className="metric-divider"></div>
              <div className="corp-metric-item">
                <span className="metric-number">$450M+</span>
                <span className="metric-title">Client Value Created</span>
              </div>
              <div className="metric-divider"></div>
              <div className="corp-metric-item">
                <span className="metric-number">500+</span>
                <span className="metric-title">Engineers & Architects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos / Trust Ribbon */}
      <div className="corp-trust-ribbon">
        <div className="container">
          <p className="trust-caption">TRUSTED BY INNOVATION LEADERS IN 40+ COUNTRIES</p>
          <div className="trust-logos-track">
            {['Global Finance Partners', 'Vertex Health Systems', 'OmniLogistics Worldwide', 'Apex Financial Tech', 'Nexis Semiconductor', 'AeroDynamics Global'].map((client, idx) => (
              <div key={idx} className="trust-client-badge">
                <Building2 size={16} className="text-blue-400 opacity-60" />
                <span>{client}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Solution Explorer */}
      <section id="solutions" className="corp-section solutions-section">
        <div className="container">
          <div className="corp-section-header text-center">
            <div className="section-pretitle">ENTERPRISE CAPABILITIES</div>
            <h2 className="section-maintitle">Architected for Uncompromising Scale</h2>
            <p className="section-intro">
              Explore how our multidisciplinary practices accelerate transformation, de-risk operations, and optimize cloud economics.
            </p>
          </div>

          <div className="solution-interactive-wrapper">
            {/* Solution Navigation Tabs */}
            <div className="solution-tabs-nav">
              {solutionTabs.map((sol) => {
                const Icon = sol.icon;
                const isSelected = activeSolution.id === sol.id;
                return (
                  <button
                    key={sol.id}
                    className={`sol-tab-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveSolution(sol)}
                  >
                    <div className="sol-tab-icon">
                      <Icon size={20} />
                    </div>
                    <div className="sol-tab-text">
                      <span className="sol-tab-label">{sol.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Solution Deep Dive Card */}
            <div className="solution-detail-card">
              <div className="sol-detail-header">
                <div className="sol-badge-category">{activeSolution.label}</div>
                <h3 className="sol-detail-tagline">{activeSolution.tagline}</h3>
                <p className="sol-detail-desc">{activeSolution.description}</p>
              </div>

              <div className="sol-deliverables-box">
                <h4>Core Architectural Deliverables:</h4>
                <div className="sol-deliverables-grid">
                  {activeSolution.deliverables.map((item, i) => (
                    <div key={i} className="deliverable-item">
                      <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sol-action-row">
                <a href="#consultation" className="corp-link-action">
                  <span>Speak with our {activeSolution.label} Lead Architect</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Enterprise ROI Model */}
      <section id="roi-calculator" className="corp-section roi-section">
        <div className="container">
          <div className="roi-card-glass">
            <div className="roi-grid">
              <div className="roi-controls">
                <div className="section-pretitle text-cyan-400">FINANCIAL IMPACT SIMULATOR</div>
                <h2 className="roi-title">Calculate Your Modernization ROI</h2>
                <p className="roi-desc">
                  Based on audited benchmarking from 120+ enterprise engagements across North America and Europe.
                </p>

                {/* Slider 1: Team Size */}
                <div className="calculator-group">
                  <div className="calc-label-row">
                    <span>Engineering / Knowledge Team Size</span>
                    <strong>{teamSize.toLocaleString()} users</strong>
                  </div>
                  <input 
                    type="range" 
                    min="25" 
                    max="1500" 
                    step="25"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="corp-slider"
                  />
                  <div className="slider-ticks">
                    <span>25</span>
                    <span>500</span>
                    <span>1,500+</span>
                  </div>
                </div>

                {/* Slider 2: Annual Cloud Spend */}
                <div className="calculator-group">
                  <div className="calc-label-row">
                    <span>Current Annual Cloud / Infra Budget</span>
                    <strong>${(cloudSpend / 1000).toFixed(0)}k / year</strong>
                  </div>
                  <input 
                    type="range" 
                    min="50000" 
                    max="1500000" 
                    step="25000"
                    value={cloudSpend}
                    onChange={(e) => setCloudSpend(Number(e.target.value))}
                    className="corp-slider"
                  />
                  <div className="slider-ticks">
                    <span>$50k</span>
                    <span>$750k</span>
                    <span>$1.5M+</span>
                  </div>
                </div>
              </div>

              {/* ROI Output Card */}
              <div className="roi-results-box">
                <div className="results-badge">PROJECTION OUTPUT</div>

                <div className="roi-stat-main">
                  <span className="roi-label">Projected Cloud Cost Reduction</span>
                  <div className="roi-big-number">${estimatedSavings.toLocaleString()}</div>
                  <span className="roi-subtext">Estimated annual direct cloud OPEX savings</span>
                </div>

                <div className="roi-stat-secondary">
                  <div className="sec-stat-item">
                    <span className="sec-stat-val">{hoursSavedPerYear.toLocaleString()} hrs</span>
                    <span className="sec-stat-lbl">Developer productivity hours reclaimed/yr</span>
                  </div>
                  <div className="sec-stat-item">
                    <span className="sec-stat-val">&lt; 4.2 mos</span>
                    <span className="sec-stat-lbl">Payback period on implementation</span>
                  </div>
                </div>

                <a href="#consultation" className="roi-cta-btn">
                  <span>Receive Full 18-Page Assessment</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="corp-section">
        <div className="container">
          <div className="corp-section-header text-center">
            <div className="section-pretitle">VALIDATED OUTCOMES</div>
            <h2 className="section-maintitle">Proven Enterprise Case Studies</h2>
          </div>

          <div className="case-studies-modern-grid">
            {(corporateCaseStudies || []).slice(0, 3).map((study, idx) => (
              <div key={idx} className="modern-case-card">
                <div className="case-card-header">
                  <span className="case-client-tag">{study.client}</span>
                  <span className="case-date-tag">Completed</span>
                </div>
                <h3 className="case-card-title">{study.title}</h3>
                <p className="case-card-desc">{study.description}</p>
                
                <div className="case-results-list">
                  {(study.results || []).map((res, rIdx) => (
                    <div key={rIdx} className="case-result-badge">
                      <TrendingUp size={14} className="text-cyan-400" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Consultation Form */}
      <section id="consultation" className="corp-section consultation-section">
        <div className="container">
          <div className="consult-grid">
            <div className="consult-info">
              <div className="section-pretitle text-cyan-400">CONNECT WITH LEADERSHIP</div>
              <h2 className="consult-title">Schedule an Executive Consultation</h2>
              <p className="consult-desc">
                Engage directly with our Principal Architects and Practice Directors. 
                All inquiries are covered under mutual non-disclosure agreements.
              </p>

              <div className="consult-perks">
                <div className="perk-row">
                  <CheckCircle2 size={18} className="text-cyan-400" />
                  <span>30-minute tailored architectural roadmap review</span>
                </div>
                <div className="perk-row">
                  <CheckCircle2 size={18} className="text-cyan-400" />
                  <span>Zero-obligation preliminary infrastructure cost audit</span>
                </div>
                <div className="perk-row">
                  <CheckCircle2 size={18} className="text-cyan-400" />
                  <span>Direct access to certified AWS & Google Cloud Fellows</span>
                </div>
              </div>
            </div>

            <div className="consult-form-box">
              {submitted ? (
                <div className="consult-success-state">
                  <div className="success-icon-ring">
                    <Check size={32} className="text-emerald-400" />
                  </div>
                  <h3>Briefing Request Received</h3>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. A Managing Director from our 
                    Enterprise Practice will reach out to <strong>{formData.email}</strong> within 4 business hours.
                  </p>
                  <button className="corp-btn-glass" onClick={() => setSubmitted(false)}>
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="consult-form">
                  <div className="form-field-row">
                    <div className="form-field">
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Corporate Email *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="s.jenkins@enterprise.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-field-row">
                    <div className="form-field">
                      <label>Company / Organization *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Global Corp Inc."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Primary Focus Practice</label>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      >
                        <option>Cloud Architecture & DevOps</option>
                        <option>Enterprise AI & Data Strategy</option>
                        <option>Zero-Trust Security & Compliance</option>
                        <option>Legacy Core Modernization</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Brief Objective or Timeline</label>
                    <textarea 
                      rows={3} 
                      placeholder="Tell us about your upcoming initiatives or modernization goals..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="corp-submit-btn">
                    <span>Confirm Consultation Request</span>
                    <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CorporateHome;
