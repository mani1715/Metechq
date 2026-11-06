import React, { useState, useMemo, useEffect } from 'react';
import SEO from '../components/SEO';
import { Breadcrumb, Home as HomeIcon, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import projectService from '../services/projectService';
import ProjectCard from '../components/portfolio/ProjectCard';
import PortfolioFilters from '../components/portfolio/PortfolioFilters';
import TagCloud from '../components/portfolio/TagCloud';
import Pagination from '../components/portfolio/Pagination';
import QuickViewModal from '../components/portfolio/QuickViewModal';
import { trackPageView } from '../services/analytics';
import './pages.css';

const PROJECTS_PER_PAGE = 6;

const Portfolio = () => {
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch projects from API
  useEffect(() => {
    // Track page view
    trackPageView('portfolio');
    
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getPublicProjects();
        // Transform backend data to match frontend structure
        const transformedProjects = data.map(project => {
          const img = project.image_url || project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60';
          const tech = project.tech_stack || project.technologies || [];
          const live = project.live_demo_url || project.liveUrl || '';
          const github = project.github_url || project.githubUrl || '';
          return {
            ...project,
            id: project.id || project._id,
            title: project.title,
            slug: project.slug,
            category: project.category,
            description: project.description,
            image: img,
            image_url: img,
            images: (project.images && project.images.length > 0) ? project.images : [img],
            technologies: tech,
            tech_stack: tech,
            featured: Boolean(project.featured),
            liveUrl: live,
            live_demo_url: live,
            github_url: github,
            status: project.status,
            date: project.created_at || project.date
          };
        });
        setPortfolioProjects(transformedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(portfolioProjects.map(p => p.category))];
    return cats;
  }, [portfolioProjects]);

  // Calculate tag frequencies
  const techTags = useMemo(() => {
    const tagCount = {};
    portfolioProjects.forEach(project => {
      project.technologies.forEach(tech => {
        tagCount[tech] = (tagCount[tech] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [portfolioProjects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = portfolioProjects;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => 
        selectedTags.every(tag => p.technologies.includes(tag))
      );
    }

    // Sort projects
    switch (sortBy) {
      case 'featured':
        filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [portfolioProjects, selectedCategory, searchQuery, sortBy, selectedTags]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy, selectedTags]);

  const handleTagClick = (tagName) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const openQuickView = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeQuickView = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "METECHQ Portfolio",
    "description": "Explore our portfolio of web development projects including e-commerce platforms, dashboards, and custom web applications.",
    "provider": {
      "@type": "Organization",
      "name": "METECHQ",
      "url": "https://metechq.com"
    },
    "hasPart": portfolioProjects.map(project => ({
      "@type": "CreativeWork",
      "name": project.title,
      "description": project.description,
      "image": project.image,
      "keywords": project.technologies.join(', ')
    }))
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title="Portfolio - METECHQ | Web Development Projects"
        description="Explore METECHQ's portfolio of web development projects including e-commerce platforms, web applications, dashboards, and UI/UX design work. View live demos and case studies."
        keywords="web development portfolio, react projects, e-commerce websites, web applications, METECHQ projects"
        canonical="https://metechq.com/portfolio"
        structuredData={structuredData}
      />

      <div className="portfolio-page-premium">
        {/* Portfolio Hero Section */}
        <section className="portfolio-hero-premium" data-admin-editable="portfolio-hero">
          <div className="portfolio-hero-background">
            <div className="hero-gradient-orb orb-1"></div>
            <div className="hero-gradient-orb orb-2"></div>
            <div className="hero-sparkles">
              <Sparkles className="sparkle sparkle-1" />
              <Sparkles className="sparkle sparkle-2" />
              <Sparkles className="sparkle sparkle-3" />
            </div>
          </div>

          <div className="portfolio-hero-container">
            {/* Breadcrumb Navigation */}
            <nav className="portfolio-breadcrumb" aria-label="Breadcrumb">
              <Link to="/" className="breadcrumb-link">
                <HomeIcon className="breadcrumb-icon" />
                <span>Home</span>
              </Link>
              <ChevronRight className="breadcrumb-separator" />
              <span className="breadcrumb-current">Portfolio</span>
            </nav>

            <div className="portfolio-hero-badge" data-admin-editable="portfolio-badge">
              <Sparkles className="badge-icon" />
              <span>Our Work</span>
            </div>
            
            <h1 className="portfolio-hero-title" data-admin-editable="portfolio-title">
              Our Portfolio
            </h1>
            
            <p className="portfolio-hero-description" data-admin-editable="portfolio-description">
              Explore our collection of successful projects spanning e-commerce platforms, 
              web applications, dashboards, and innovative UI/UX designs. Each project showcases 
              our commitment to quality, innovation, and client satisfaction.
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="portfolio-content-section">
          <div className="section-container-premium">
            <PortfolioFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalProjects={portfolioProjects.length}
              filteredCount={filteredProjects.length}
            />

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="selected-tags-bar">
                <span className="selected-tags-label">Filtered by:</span>
                {selectedTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="selected-tag-chip"
                  >
                    {tag}
                    <span className="tag-remove">×</span>
                  </button>
                ))}
                <button
                  onClick={() => setSelectedTags([])} 
                  className="clear-tags-btn"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Projects Grid */}
            {paginatedProjects.length > 0 ? (
              <>
                <div className="portfolio-grid-premium">
                  {paginatedProjects.map((project, index) => (
                    <div 
                      key={project.id} 
                      style={{ animationDelay: `${index * 0.1}s` }}
                      className="portfolio-grid-item"
                    >
                      <ProjectCard project={project} onQuickView={openQuickView} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="no-projects-found">
                <p className="no-projects-text">
                  No projects found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setSelectedTags([]);
                  }}
                  className="reset-filters-btn"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Tag Cloud Section */}
        <section className="tag-cloud-section-wrapper">
          <div className="section-container-premium">
            <TagCloud
              tags={techTags}
              onTagClick={handleTagClick}
              selectedTags={selectedTags}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="portfolio-cta-section" data-admin-editable="portfolio-cta">
          <div className="cta-background-gradient"></div>
          <div className="portfolio-cta-container">
            <h2 className="portfolio-cta-title" data-admin-editable="cta-title">
              Have a Project in Mind?
            </h2>
            <p className="portfolio-cta-description" data-admin-editable="cta-description">
              Let's collaborate and bring your vision to life with cutting-edge web solutions.
            </p>
            <Link to="/contact">
              <button className="portfolio-cta-button">
                Start Your Project
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
          </div>
        </section>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeQuickView}
      />
    </>
  );
};

export default Portfolio;
