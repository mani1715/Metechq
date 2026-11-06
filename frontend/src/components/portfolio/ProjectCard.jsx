import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Star, Eye } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import './portfolio-components.css';

const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60';

const ProjectCard = ({ project, onQuickView }) => {
  if (!project) return null;

  const id = project.id || project._id;
  const title = project.title || 'Untitled Project';
  const slug = project.slug || id;
  const category = project.category || 'Web Development';
  const description = project.description || '';
  const imageUrl = project.image_url || project.image || DEFAULT_PROJECT_IMAGE;
  const techStack = project.tech_stack || project.technologies || [];
  const featured = Boolean(project.featured);
  const liveDemoUrl = project.live_demo_url || project.liveUrl;
  const githubUrl = project.github_url || project.githubUrl;

  return (
    <Card className="project-card-premium" data-admin-editable={`project-${id}`}>
      {/* Featured Badge */}
      {featured && (
        <div className="project-featured-badge">
          <Star className="h-3 w-3" fill="currentColor" />
          <span>Featured</span>
        </div>
      )}

      {/* Project Image */}
      <div className="project-card-image-wrapper">
        <img
          src={imageUrl}
          alt={title}
          className="project-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_PROJECT_IMAGE;
          }}
        />

        {/* Hover Overlay */}
        <div className="project-card-overlay">
          <div className="project-overlay-buttons">
            <Link to={`/portfolio/${slug || id}`}>
              <Button className="project-overlay-btn btn-view">
                <span>View Case Study</span>
              </Button>
            </Link>

            {onQuickView && (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(project);
                }}
                className="project-overlay-btn btn-view"
              >
                <Eye className="h-4 w-4 mr-1" />
                <span>Quick View</span>
              </Button>
            )}

            {liveDemoUrl && (
              <a href={liveDemoUrl} target="_blank" rel="noopener noreferrer">
                <Button className="project-overlay-btn btn-demo">
                  <ExternalLink className="h-4 w-4" />
                  <span>Live Demo</span>
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Category Badge */}
        {category && (
          <div className="project-category-badge">
            {category}
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="project-card-content">
        <h3 className="project-card-title">
          {title}
        </h3>

        <p className="project-card-description">
          {description}
        </p>

        {/* Tech Stack */}
        <div className="project-tech-tags">
          {techStack.slice(0, 4).map((tech, idx) => (
            <span key={idx} className="tech-tag">
              {tech}
            </span>
          ))}
          {techStack.length > 4 && (
            <span className="tech-tag tech-tag-more">
              +{techStack.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="project-card-footer">
          <Link to={`/portfolio/${slug || id}`} className="project-read-more">
            View Details →
          </Link>

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-github-link"
              aria-label="GitHub Repository"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="project-card-gradient"></div>
    </Card>
  );
};

export default ProjectCard;
