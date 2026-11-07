import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Award, Target, Zap, Shield, Sparkles,
  CheckCircle, Briefcase, Users, TrendingUp, Layers,
  Code2, Star
} from 'lucide-react';
import aboutService from '../services/aboutService';
import { trackPageView } from '../services/analytics';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import './pages.css';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setError(null);
        const data = await aboutService.getAboutContent();

        if (data) {
          setAboutData(data);
        } else {
          // Use default content if API returns null
          setAboutData(getDefaultAboutContent());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading about content:', error);
        setError(error);
        // Use default content on error
        setAboutData(getDefaultAboutContent());
        setLoading(false);
      }
    };

    fetchAboutContent();
    // Track page view
    trackPageView('about');
  }, []);

  // Default content fallback
  const getDefaultAboutContent = () => ({
    hero_badge: "Premium Web Development Agency",
    hero_title: "About METECHQ",
    hero_subtitle: "Crafting Digital Excellence Through Innovation & Precision",
    hero_description: "Building exceptional digital experiences that transform businesses and delight users worldwide.",
    story_title: "Our Story",
    story_paragraphs: [
      "Founded by Maneesh, a passionate and skilled full-stack developer, METECHQ was born from a vision to help businesses thrive in the digital age.",
      "We specialize in full-stack development, creating custom websites and e-commerce platforms that perform exceptionally.",
    ],
    story_expertise: [
      "Full-Stack Web Development",
      "Custom Website Design",
      "E-commerce Solutions",
      "Responsive Design",
      "API Development",
    ],
    values_badge: "Our Values",
    values_title: "Principles That Drive Us",
    values_description: "The core values that guide every project and client relationship",
    values: [
      { id: "1", icon: "Award", title: "Excellence", description: "We strive for excellence in every line of code." },
      { id: "2", icon: "Target", title: "Innovation", description: "Staying ahead with cutting-edge solutions." },
      { id: "3", icon: "Zap", title: "Efficiency", description: "Delivering projects on time without sacrificing quality." },
      { id: "4", icon: "Shield", title: "Transparency", description: "Open communication and honesty in every interaction." },
    ],
    achievements_badge: "Achievements",
    achievements_title: "Numbers That Speak",
    achievements: [
      { id: "1", icon: "Briefcase", value: "50+", label: "Projects Completed" },
      { id: "2", icon: "Users", value: "35+", label: "Happy Clients" },
      { id: "3", icon: "TrendingUp", value: "3+", label: "Years Experience" },
      { id: "4", icon: "Layers", value: "10+", label: "Technologies" },
    ],
    founder_badge: "Meet the Founder",
    founder_title: "The Mind Behind METECHQ",
    founder_name: "Maneesh",
    founder_role: "Full-Stack Developer & Founder",
    founder_bio: "With a passion for creating seamless digital experiences, Maneesh brings years of expertise in full-stack development.",
    founder_skills: ["HTML, CSS, JavaScript", "React & Node.js", "Full-Stack Development", "E-commerce Solutions"],
    cta_title: "Ready to Start Your Project?",
    cta_description: "Let's collaborate to bring your vision to life.",
    cta_button_text: "Get In Touch",
    cta_button_link: "/contact"
  });

  // Icon mapping
  const iconMap = {
    Award: Award,
    Target: Target,
    Zap: Zap,
    Shield: Shield,
    Briefcase: Briefcase,
    Users: Users,
    TrendingUp: TrendingUp,
    Layers: Layers
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '20px', color: '#6B7280' }}>Loading...</p>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <p style={{ color: '#6B7280' }}>Unable to load content. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="about-page-premium">
      {/* HERO SECTION */}
      <section className="about-hero-premium" data-admin-editable="about-hero">
        <div className="about-hero-background">
          <div className="hero-gradient-orb orb-1"></div>
          <div className="hero-gradient-orb orb-2"></div>
          <div className="hero-sparkles">
            <Sparkles className="sparkle sparkle-1" />
            <Sparkles className="sparkle sparkle-2" />
            <Sparkles className="sparkle sparkle-3" />
          </div>
        </div>
        <div className="about-hero-container">
          <div className="about-hero-badge" data-admin-editable="about-badge">
            <Star className="badge-icon" fill="currentColor" />
            <span>{aboutData.hero_badge}</span>
          </div>
          <h1 className="about-hero-title" data-admin-editable="about-title">
            {aboutData.hero_title}
          </h1>
          <p className="about-hero-subtitle" data-admin-editable="about-subtitle">
            {aboutData.hero_subtitle}
          </p>
          <p className="about-hero-description" data-admin-editable="about-description">
            {aboutData.hero_description}
          </p>
        </div>
      </section>

      {/* STORY SECTION - Two Column Layout */}
      <section className="story-section-premium" data-admin-editable="story-section">
        <div className="story-container-premium">
          <div className="story-grid">
            {/* Left Side - Visual */}
            <div className="story-visual" data-admin-editable="story-visual">
              <div className="story-image-card">
                <div className="story-floating-badge badge-1">
                  <Code2 className="h-6 w-6" />
                  <span>Full-Stack</span>
                </div>
                <div className="story-floating-badge badge-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Premium Quality</span>
                </div>
                <div className="story-image-placeholder">
                  <div className="code-illustration">
                    <div className="code-line line-1"></div>
                    <div className="code-line line-2"></div>
                    <div className="code-line line-3"></div>
                    <div className="code-line line-4"></div>
                    <div className="code-circle circle-1"></div>
                    <div className="code-circle circle-2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="story-content" data-admin-editable="story-content">
              <div className="section-badge-premium" data-admin-editable="story-badge">
                Our Story
              </div>
              <h2 className="story-title-premium" data-admin-editable="story-title">
                {aboutData.story_title}
              </h2>

              {aboutData.story_paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="story-paragraph-premium"
                  data-admin-editable={`story-paragraph-${index + 1}`}
                >
                  {paragraph}
                </p>
              ))}

              {/* Expertise List */}
              <div className="expertise-list" data-admin-editable="expertise-list">
                <h3 className="expertise-title">Core Expertise:</h3>
                <div className="expertise-grid">
                  {aboutData.story_expertise.map((item, index) => (
                    <div
                      key={index}
                      className="expertise-item"
                      data-admin-editable={`expertise-${index + 1}`}
                    >
                      <CheckCircle className="expertise-icon" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES SECTION */}
      <section className="values-section-premium" data-admin-editable="values-section">
        <div className="values-container-premium">
          <div className="section-header-premium">
            <div className="section-badge-premium" data-admin-editable="values-badge">
              {aboutData.values_badge}
            </div>
            <h2 className="section-title-premium" data-admin-editable="values-title">
              {aboutData.values_title}
            </h2>
            <p className="section-description-premium" data-admin-editable="values-description">
              {aboutData.values_description}
            </p>
          </div>

          <div className="values-grid-premium">
            {aboutData.values?.map((value, index) => {
              const IconComponent = iconMap[value.icon] || Award;
              return (
                <Card
                  key={value.id}
                  className="value-card-premium"
                  data-admin-editable={`value-${value.id}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="value-icon-wrapper">
                    <div className="value-icon-premium">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <div className="value-glow"></div>
                  </div>

                  <h3 className="value-title-premium" data-admin-editable={`value-title-${value.id}`}>
                    {value.title}
                  </h3>

                  <p className="value-description-premium" data-admin-editable={`value-desc-${value.id}`}>
                    {value.description}
                  </p>

                  <div className="value-card-border"></div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section className="tech-stack-section-premium" data-admin-editable="tech-stack-section">
        <div className="tech-stack-container">
          <div className="section-header-premium">
            <div className="section-badge-premium" data-admin-editable="tech-badge">
              Technologies
            </div>
            <h2 className="section-title-premium" data-admin-editable="tech-title">
              Our Technology Stack
            </h2>
            <p className="section-description-premium" data-admin-editable="tech-description">
              Proficient in cutting-edge technologies that power modern web applications
            </p>
          </div>

          {/* Simple Skills Cloud from story expertise */}
          <div className="skills-cloud-premium" data-admin-editable="skills-cloud">
            {aboutData.story_expertise?.map((skill, index) => (
              <span
                key={index}
                className="skill-tag-premium"
                data-admin-editable={`skill-${index + 1}`}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS / STATS SECTION */}
      <section className="achievements-section-premium" data-admin-editable="achievements-section">
        <div className="achievements-container">
          <div className="section-header-premium">
            <div className="section-badge-premium" data-admin-editable="achievements-badge">
              {aboutData.achievements_badge}
            </div>
            <h2 className="section-title-premium" data-admin-editable="achievements-title">
              {aboutData.achievements_title}
            </h2>
          </div>

          <div className="achievements-grid-premium">
            {aboutData.achievements?.map((achievement, index) => {
              const IconComponent = iconMap[achievement.icon] || Star;
              return (
                <div
                  key={achievement.id}
                  className="achievement-card-premium"
                  data-admin-editable={`achievement-${achievement.id}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="achievement-icon-premium">
                    <IconComponent className="h-10 w-10" />
                  </div>
                  <div className="achievement-value" data-admin-editable={`achievement-value-${achievement.id}`}>
                    {achievement.value}
                  </div>
                  <div className="achievement-label" data-admin-editable={`achievement-label-${achievement.id}`}>
                    {achievement.label}
                  </div>
                  <div className="achievement-glow"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section className="founder-section-premium" data-admin-editable="founder-section">
        <div className="founder-container">
          <div className="section-header-premium">
            <div className="section-badge-premium" data-admin-editable="founder-badge">
              {aboutData.founder_badge}
            </div>
            <h2 className="section-title-premium" data-admin-editable="founder-title">
              {aboutData.founder_title}
            </h2>
          </div>

          <Card className="founder-card-premium" data-admin-editable="founder-card">
            {/* Founder Info - No Image as per user request */}
            <div style={{ padding: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <h3 className="founder-name" data-admin-editable="founder-name" style={{ fontSize: '32px', fontWeight: '700', marginBottom: '12px', color: '#352a21' }}>
                {aboutData.founder_name}
              </h3>
              <p className="founder-role" data-admin-editable="founder-role" style={{ fontSize: '18px', color: '#a34e1d', fontWeight: '500', marginBottom: '24px' }}>
                {aboutData.founder_role}
              </p>
              <p className="founder-bio" data-admin-editable="founder-bio" style={{ fontSize: '16px', lineHeight: '1.8', color: '#6B7280', marginBottom: '32px' }}>
                {aboutData.founder_bio}
              </p>

              {/* Founder Skills */}
              <div className="founder-skills" data-admin-editable="founder-skills">
                <h4 className="founder-skills-title" style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#352a21' }}>
                  Specializations:
                </h4>
                <div className="founder-skills-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {aboutData.founder_skills?.map((skill, index) => (
                    <div
                      key={index}
                      className="founder-skill-item"
                      data-admin-editable={`founder-skill-${index + 1}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}
                    >
                      <CheckCircle className="skill-check" style={{ color: '#a34e1d', width: '18px', height: '18px' }} />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section-premium-about" data-admin-editable="cta-section">
        <div className="cta-background-gradient-about"></div>
        <div className="cta-container-premium-about">
          <div className="cta-sparkles-wrapper-about">
            <Sparkles className="cta-sparkle sparkle-1" />
            <Sparkles className="cta-sparkle sparkle-2" />
            <Sparkles className="cta-sparkle sparkle-3" />
          </div>

          <h2 className="cta-title-premium-about" data-admin-editable="cta-title">
            {aboutData.cta_title}
          </h2>

          <p className="cta-description-premium-about" data-admin-editable="cta-description">
            {aboutData.cta_description}
          </p>

          <Link to={aboutData.cta_button_link} data-admin-editable="cta-button-link">
            <Button className="cta-gold-large-about">
              <span data-admin-editable="cta-button-text">{aboutData.cta_button_text}</span>
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
