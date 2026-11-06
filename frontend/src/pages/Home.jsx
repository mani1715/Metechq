import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, ShoppingCart, Layers, Palette, Star, TrendingUp, Users, Briefcase, Zap, Sparkles, CheckCircle, Award, BadgeCheck } from 'lucide-react';
import { agencyInfo, services, stats, testimonials } from '../data/mock';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import api from '../services/api';
import projectService from '../services/projectService';
import { getPublicTestimonials } from '../services/testimonialService';
import { trackPageView } from '../services/analytics';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [content, setContent] = useState(null);
  const [aboutContent, setAboutContent] = useState(null);
  const [clientTestimonials, setClientTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
    // Track page view
    trackPageView('home');
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch home content, about content, projects, and testimonials with error handling
      const [homeResponse, aboutResponse, projectsData, testimonialsData] = await Promise.allSettled([
        api.get('/content/').catch(err => {
          console.warn('Home content fetch failed, using defaults');
          return { data: null };
        }),
        api.get('/about/').catch(err => {
          console.warn('About content fetch failed, will use defaults for stats');
          return { data: null };
        }),
        projectService.getPublicProjects().catch(err => {
          console.warn('Projects fetch failed, using empty array');
          return [];
        }),
        getPublicTestimonials().catch(err => {
          console.warn('Testimonials fetch failed, using empty array');
          return [];
        })
      ]);
      
      // Handle fulfilled promises
      if (homeResponse.status === 'fulfilled' && homeResponse.value?.data) {
        setContent(homeResponse.value.data);
      }
      
      if (aboutResponse.status === 'fulfilled' && aboutResponse.value?.data) {
        setAboutContent(aboutResponse.value.data);
      }

      // Handle projects data
      if (projectsData.status === 'fulfilled' && projectsData.value) {
        const projects = projectsData.value;
        const featured = projects
          .filter(p => p.featured)
          .slice(0, 3)
          .map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            category: p.category,
            description: p.description,
            image: p.image_url,
            technologies: p.tech_stack || [],
            featured: p.featured
          }));
        setFeaturedProjects(featured);
      }

      // Handle testimonials data
      if (testimonialsData.status === 'fulfilled' && testimonialsData.value) {
        setClientTestimonials(testimonialsData.value);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  // Use content from API or fallback to defaults
  const heroData = content ? {
    badge: '',
    headline: content.hero_headline,
    subheadline: content.hero_subheadline,
    description: content.hero_description,
    cta1: { text: content.hero_cta1_text, link: '/contact' },
    cta2: { text: content.hero_cta2_text, link: '/portfolio' }
  } : {
    badge: '',
    headline: 'Build Your Dream Website',
    subheadline: 'METECHQ Web Development Solutions',
    description: 'Transform your vision into stunning reality with our premium web development services.',
    cta1: { text: 'Start Your Project', link: '/contact' },
    cta2: { text: 'View Our Work', link: '/portfolio' }
  };

  // Icon mapping for achievements
  const iconMap = {
    Briefcase: Briefcase,
    Users: Users,
    TrendingUp: TrendingUp,
    Layers: Layers,
    Zap: Zap,
    Award: Star
  };

  // Use About achievements if available, otherwise fallback to content stats or defaults
  const statsData = aboutContent?.achievements ? 
    aboutContent.achievements.map((achievement, index) => ({
      id: index + 1,
      icon: iconMap[achievement.icon] || Briefcase,
      value: achievement.value,
      label: achievement.label,
      color: index % 2 === 0 ? 'gold' : 'purple'
    }))
  : content ? [
    { id: 1, icon: Briefcase, value: content.stat_projects_value, label: content.stat_projects_label, color: 'gold' },
    { id: 2, icon: Users, value: content.stat_clients_value, label: content.stat_clients_label, color: 'purple' },
    { id: 3, icon: TrendingUp, value: content.stat_experience_value, label: content.stat_experience_label, color: 'gold' },
    { id: 4, icon: Zap, value: content.stat_satisfaction_value, label: content.stat_satisfaction_label, color: 'purple' }
  ] : [
    { id: 1, icon: Briefcase, value: '50+', label: 'Completed Projects', color: 'gold' },
    { id: 2, icon: Users, value: '35+', label: 'Happy Clients', color: 'purple' },
    { id: 3, icon: TrendingUp, value: '3+', label: 'Years Experience', color: 'gold' },
    { id: 4, icon: Zap, value: '98%', label: 'Client Satisfaction', color: 'purple' }
  ];

  const servicesData = [
    {
      id: 1,
      icon: Code,
      title: 'Custom Website Development',
      description: 'Bespoke websites tailored to your brand, built with cutting-edge technology and optimized for performance.',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading']
    },
    {
      id: 2,
      icon: ShoppingCart,
      title: 'E-commerce Solutions',
      description: 'Complete online stores with secure payments, inventory management, and seamless checkout experiences.',
      features: ['Payment Integration', 'Product Management', 'Analytics Dashboard']
    },
    {
      id: 3,
      icon: Layers,
      title: 'Full-Stack Development',
      description: 'End-to-end application development with robust backends, modern frontends, and cloud deployment.',
      features: ['API Development', 'Database Design', 'Cloud Hosting']
    },
    {
      id: 4,
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive interfaces that enhance user experience and drive meaningful engagement.',
      features: ['User Research', 'Prototyping', 'Brand Identity']
    }
  ];

  return (
    <div className="home-page-new">
      {/* Hero Section - Premium Left-Right Layout */}
      <section className="hero-section-premium" data-admin-editable="hero-section">
        <div className="hero-background-sparkles"></div>
        <div className="hero-container">
          {/* Left Side - Content */}
          <div className="hero-left" data-admin-editable="hero-content">
            {heroData.badge && (
              <div className="hero-badge-premium" data-admin-editable="hero-badge">
                <Sparkles className="badge-icon" />
                <span>{heroData.badge}</span>
              </div>
            )}
            
            <h1 className="hero-headline-premium" data-admin-editable="hero-headline">
              {heroData.headline}
            </h1>
            
            <h2 className="hero-subheadline-premium" data-admin-editable="hero-subheadline">
              {heroData.subheadline}
            </h2>
            
            <p className="hero-description-premium" data-admin-editable="hero-description">
              {heroData.description}
            </p>
            
            <div className="hero-cta-buttons">
              <Link to={heroData.cta1.link} data-admin-editable="hero-cta1">
                <Button className="cta-gold-gradient">
                  <span data-admin-editable="cta1-text">{heroData.cta1.text}</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={heroData.cta2.link} data-admin-editable="hero-cta2">
                <Button className="cta-purple-outline">
                  <span data-admin-editable="cta2-text">{heroData.cta2.text}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Floating 3D Cards */}
          <div className="hero-right" data-admin-editable="hero-visual">
            <div className="floating-cards-container">
              <div className="floating-card card-1" data-admin-editable="float-card-1">
                <Code className="float-icon" />
                <div className="float-text">
                  <div className="float-title">Web Development</div>
                  <div className="float-subtitle">Custom Solutions</div>
                </div>
              </div>
              
              <div className="floating-card card-2" data-admin-editable="float-card-2">
                <ShoppingCart className="float-icon" />
                <div className="float-text">
                  <div className="float-title">E-commerce</div>
                  <div className="float-subtitle">Online Stores</div>
                </div>
              </div>
              
              <div className="floating-card card-3" data-admin-editable="float-card-3">
                <Palette className="float-icon" />
                <div className="float-text">
                  <div className="float-title">UI/UX Design</div>
                  <div className="float-subtitle">Beautiful Interfaces</div>
                </div>
              </div>
              
              <div className="hero-decoration-circle circle-1"></div>
              <div className="hero-decoration-circle circle-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar / Stats Section */}
      <section className="stats-bar-premium" data-admin-editable="stats-section">
        <div className="stats-container-premium">
          {statsData.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.id} 
                className={`stat-item-premium stat-${stat.color}`}
                data-admin-editable={`stat-${stat.id}`}
              >
                <div className="stat-icon-premium">
                  <IconComponent className="h-8 w-8" />
                </div>
                <div className="stat-content-premium">
                  <div className="stat-value-premium" data-admin-editable={`stat-value-${stat.id}`}>
                    {stat.value}
                  </div>
                  <div className="stat-label-premium" data-admin-editable={`stat-label-${stat.id}`}>
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="services-section-premium" data-admin-editable="services-section">
        <div className="section-container-premium">
          <div className="section-header-premium">
            <div className="section-badge" data-admin-editable="services-badge">
              {content?.services_badge || 'Our Services'}
            </div>
            <h2 className="section-title-premium" data-admin-editable="services-title">
              {content?.services_title || 'Premium Web Solutions'}
            </h2>
            <p className="section-description-premium" data-admin-editable="services-description">
              {content?.services_description || 'Comprehensive development services tailored to elevate your digital presence'}
            </p>
          </div>

          <div className="services-grid-premium">
            {servicesData.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id} 
                  className="service-card-premium"
                  data-admin-editable={`service-${service.id}`}
                >
                  <div className="service-card-header">
                    <div className="service-icon-premium">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <div className="service-sparkle">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <h3 className="service-title-premium" data-admin-editable={`service-title-${service.id}`}>
                    {service.title}
                  </h3>
                  
                  <p className="service-description-premium" data-admin-editable={`service-desc-${service.id}`}>
                    {service.description}
                  </p>
                  
                  <ul className="service-features-list">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="service-feature-item">
                        <CheckCircle className="feature-check" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="service-card-gradient"></div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="projects-section-premium" data-admin-editable="projects-section">
        <div className="section-container-premium">
          <div className="section-header-premium">
            <div className="section-badge" data-admin-editable="projects-badge">
              {content?.projects_badge || 'Our Portfolio'}
            </div>
            <h2 className="section-title-premium" data-admin-editable="projects-title">
              {content?.projects_title || 'Featured Projects'}
            </h2>
            <p className="section-description-premium" data-admin-editable="projects-description">
              {content?.projects_description || 'Explore our latest work and successful client collaborations'}
            </p>
          </div>

          <div className="projects-grid-premium">
            {featuredProjects.map((project, index) => (
              <Link 
                key={project.id} 
                to={`/portfolio/${project.id}`} 
                className="project-card-premium"
                data-admin-editable={`project-${project.id}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="project-image-container">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="project-image-premium"
                    loading="lazy"
                  />
                  <div className="project-overlay-premium">
                    <span className="project-category-badge">{project.category}</span>
                    <div className="project-view-link">
                      <span>View Project</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                
                <div className="project-content-premium">
                  <h3 className="project-title-premium" data-admin-editable={`project-title-${project.id}`}>
                    {project.title}
                  </h3>
                  
                  <p className="project-description-premium" data-admin-editable={`project-desc-${project.id}`}>
                    {project.description}
                  </p>
                  
                  <div className="project-technologies-premium">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span 
                        key={i} 
                        className="tech-badge-premium"
                        data-admin-editable={`project-tech-${project.id}-${i}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="section-cta-center">
            <Link to="/portfolio">
              <Button className="cta-outline-premium">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Dynamic from Database */}
      {clientTestimonials.length > 0 && (
        <section style={{
          padding: '80px 0',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px'
          }}>
            {/* Section Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '64px'
            }}>
              <h2 style={{
                fontSize: '42px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                lineHeight: '1.2'
              }}>
                What Our Clients Say
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#94a3b8',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Don't just take our word for it - hear from our satisfied clients
              </p>
            </div>

            {/* Testimonials Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              marginBottom: '32px'
            }}>
              {clientTestimonials.slice(0, 6).map((testimonial) => (
                <div
                  key={testimonial.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '32px',
                    transition: 'all 0.3s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = 'rgba(234, 179, 8, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {/* Rating Stars */}
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginBottom: '20px'
                  }}>
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={18}
                        fill={index < testimonial.rating ? '#FFC107' : 'none'}
                        stroke={index < testimonial.rating ? '#FFC107' : '#64748b'}
                        style={{ flexShrink: 0 }}
                      />
                    ))}
                  </div>

                  {/* Testimonial Message */}
                  <p style={{
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: '#e2e8f0',
                    marginBottom: '24px',
                    fontStyle: 'italic'
                  }}>
                    "{testimonial.message}"
                  </p>

                  {/* Client Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '20px'
                  }}>
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid rgba(234, 179, 8, 0.3)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#0f172a'
                      }}>
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#ffffff',
                          margin: 0
                        }}>
                          {testimonial.name}
                        </h4>
                        {testimonial.source === 'customer_submitted' && testimonial.verified && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }} title="Verified Customer">
                            <BadgeCheck size={16} style={{ color: '#3b82f6' }} />
                          </div>
                        )}
                      </div>
                      {testimonial.role && (
                        <p style={{
                          fontSize: '14px',
                          color: '#94a3b8',
                          margin: 0
                        }}>
                          {testimonial.role}
                          {testimonial.company && `, ${testimonial.company}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action for Submitting Testimonial */}
            <div style={{
              textAlign: 'center',
              marginTop: '48px'
            }}>
              <Link
                to="/submit-testimonial"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                  color: '#0f172a',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(234, 179, 8, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 179, 8, 0.3)';
                }}
              >
                <Star size={20} fill="currentColor" />
                Share Your Experience
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call-To-Action Section */}
      <section className="cta-section-premium" data-admin-editable="cta-section">
        <div className="cta-background-gradient"></div>
        <div className="cta-container-premium">
          <div className="cta-sparkles-wrapper">
            <Sparkles className="cta-sparkle sparkle-1" />
            <Sparkles className="cta-sparkle sparkle-2" />
            <Sparkles className="cta-sparkle sparkle-3" />
          </div>
          
          <h2 className="cta-title-premium" data-admin-editable="cta-heading">
            {content?.cta_heading || "Let's Build Your Website"}
          </h2>
          
          <p className="cta-description-premium" data-admin-editable="cta-description">
            {content?.cta_description || "Ready to transform your vision into reality? Let's create something extraordinary together."}
          </p>
          
          <Link to="/contact" data-admin-editable="cta-button-link">
            <Button className="cta-gold-large">
              <span data-admin-editable="cta-button-text">{content?.cta_button_text || 'Get in Touch'}</span>
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
