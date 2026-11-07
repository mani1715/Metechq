import DOMPurify from 'dompurify';
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { getBlogBySlug } from '../services/blogService';
import ShareButtons from '../components/ShareButtons';
import settingsService from '../services/settingsService';
import { trackBlogView } from '../services/analytics';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareEnabled, setShareEnabled] = useState(true);

  useEffect(() => {
    fetchBlog();
    fetchSettings();
  }, [slug]);

  const fetchSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      if (settings && typeof settings.enable_share_buttons !== 'undefined') {
        setShareEnabled(settings.enable_share_buttons);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await getBlogBySlug(slug);
      setBlog(data);
      setError(null);

      // Track blog view
      if (data && data.id) {
        trackBlogView(data.id, data.title);
      }

      // Update document title
      if (data.seo_title) {
        document.title = data.seo_title;
      } else {
        document.title = `${data.title} | METECHQ Blog`;
      }

      // Update meta description
      if (data.seo_description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', data.seo_description);
        }
      }
    } catch (err) {
      setError('Blog post not found.');
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0F1E', paddingTop: '80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ color: '#fff', fontSize: '18px' }}>Loading blog...</div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0F1E', paddingTop: '80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ color: '#EF4444', fontSize: '18px', marginBottom: '24px' }}>{error || 'Blog not found'}</div>
          <button
            onClick={() => navigate('/blogs')}
            style={{
              padding: '12px 32px',
              background: '#a34e1d',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0F1E', paddingTop: '80px' }}>
      {/* Header Section */}
      <section style={{
        background: '#0F1629',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Back Button */}
          <Link
            to="/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#a34e1d',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '500',
              marginBottom: '24px',
              transition: 'gap 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.gap = '12px'}
            onMouseLeave={(e) => e.currentTarget.style.gap = '8px'}
          >
            <ArrowLeft size={20} />
            Back to Blogs
          </Link>

          {/* Category Badge */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 16px',
              background: 'rgba(163, 78, 29, 0.2)',
              color: '#d7a875',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {blog.category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '15px'
            }}>
              <User size={18} />
              <span>{blog.author}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '15px'
            }}>
              <Calendar size={18} />
              <span>{formatDate(blog.created_at)}</span>
            </div>

            {/* Social Share Buttons */}
            {shareEnabled && (
              <div style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <ShareButtons
                  title={blog.title}
                  url={window.location.href}
                  showLabel={true}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {blog.cover_image && (
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px'
        }}>
          <img
            src={blog.cover_image}
            alt={blog.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '500px',
              objectFit: 'cover',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
        </section>
      )}

      {/* Blog Content */}
      <article style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 24px 80px'
      }}>
        <div
          style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '18px',
            lineHeight: '1.8',
            letterSpacing: '0.01em'
          }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content, { USE_PROFILES: { html: true } }) }}
          className="blog-content"
        />
      </article>

      {/* Global styles for blog content */}
      <style>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          color: #fff;
          font-weight: 600;
          margin-top: 32px;
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .blog-content h2 {
          font-size: 32px;
        }

        .blog-content h3 {
          font-size: 26px;
        }

        .blog-content h4 {
          font-size: 22px;
        }

        .blog-content p {
          margin-bottom: 20px;
        }

        .blog-content ul,
        .blog-content ol {
          margin: 20px 0;
          padding-left: 24px;
        }

        .blog-content li {
          margin-bottom: 8px;
        }

        .blog-content a {
          color: #d7a875;
          text-decoration: underline;
        }

        .blog-content a:hover {
          color: #a34e1d;
        }

        .blog-content code {
          background: rgba(255, 255, 255, 0.1);
          color: #d7a875;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 16px;
          font-family: 'Courier New', monospace;
        }

        .blog-content pre {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 20px;
          overflow-x: auto;
          margin: 24px 0;
        }

        .blog-content pre code {
          background: none;
          padding: 0;
          font-size: 14px;
        }

        .blog-content blockquote {
          border-left: 4px solid #a34e1d;
          padding-left: 20px;
          margin: 24px 0;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }

        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 24px 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
        }

        .blog-content th,
        .blog-content td {
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: left;
        }

        .blog-content th {
          background: rgba(163, 78, 29, 0.1);
          color: #fff;
          font-weight: 600;
        }

        .blog-content hr {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin: 32px 0;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
