"""
Enhanced portfolio seed script with comprehensive project data
"""

import sys
from pathlib import Path
from dotenv import load_dotenv

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
load_dotenv(BACKEND_DIR / ".env")

import asyncio
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path

from database import projects_collection, close_db_connection
from models.project import Project

async def seed_complete_portfolio():
    """Seed comprehensive portfolio projects"""
    print("🌱 Seeding complete portfolio with detailed projects...")
    
    # Clear existing projects
    result = await projects_collection.delete_many({})
    print(f"  Cleared {result.deleted_count} existing projects")
    
    projects_data = [
        {
            "title": "StyleHub E-Commerce Platform",
            "slug": "stylehub-ecommerce-platform",
            "category": "E-commerce",
            "description": "A modern, feature-rich e-commerce platform with seamless shopping experience, secure checkout, and real-time inventory management. Built with cutting-edge technologies for optimal performance and user experience.",
            "image_url": "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=800&fit=crop",
            "tech_stack": ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS", "Redux", "Express"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/ecommerce",
            "github_url": "",
            "case_study_content": "Built a complete e-commerce solution featuring product catalog, advanced filtering, shopping cart with persistent storage, wishlist functionality, secure checkout with Stripe integration, order tracking, and comprehensive admin dashboard for inventory management. Achieved 99.9% uptime and sub-second load times.",
            "status": "completed",
            "client_name": "Fashion Retail Inc.",
            "completion_date": "2024-11",
            "metrics": {
                "users": "10,000+",
                "performance": "40% faster",
                "revenue": "150% increase"
            }
        },
        {
            "title": "Corporate Business Website",
            "slug": "corporate-business-website",
            "category": "Corporate",
            "description": "Professional enterprise website with elegant design, showcasing company services, team profiles, client testimonials, and an integrated content management system for easy updates.",
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
            "tech_stack": ["React", "FastAPI", "PostgreSQL", "Tailwind CSS", "Framer Motion"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/corporate",
            "github_url": "",
            "case_study_content": "Designed and developed a professional corporate website with modern UI/UX principles, featuring animated sections, responsive design, team member profiles with social integration, service showcases with interactive elements, client testimonial carousel, and a contact form with backend integration. Implemented SEO best practices resulting in 200% increase in organic traffic.",
            "status": "completed",
            "client_name": "TechCorp Solutions",
            "completion_date": "2024-10",
            "metrics": {
                "traffic": "200% increase",
                "engagement": "5min avg session",
                "leads": "80% more inquiries"
            }
        },
        {
            "title": "Learning Management System (LMS)",
            "slug": "learning-management-system",
            "category": "Education",
            "description": "Comprehensive learning platform with course management, video hosting, progress tracking, quizzes, assignments, and certification system. Perfect for online education and corporate training.",
            "image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&h=800&fit=crop",
            "tech_stack": ["React", "Python", "FastAPI", "PostgreSQL", "Redis", "AWS S3", "WebRTC"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/lms",
            "github_url": "",
            "case_study_content": "Created a full-featured LMS platform with course creation tools, video upload and streaming, student enrollment system, progress tracking dashboard, quiz and assignment modules, discussion forums, live video classes using WebRTC, automated grading system, and certificate generation. Serves 5,000+ active students with 99.8% satisfaction rate.",
            "status": "completed",
            "client_name": "EduTech Academy",
            "completion_date": "2024-09",
            "metrics": {
                "students": "5,000+",
                "courses": "200+",
                "completion": "85% rate"
            }
        },
        {
            "title": "Restaurant Booking System",
            "slug": "restaurant-booking-system",
            "category": "Hospitality",
            "description": "Smart reservation platform for restaurants with real-time table availability, automated confirmations, customer management, and analytics dashboard for restaurant owners.",
            "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop",
            "tech_stack": ["React", "Firebase", "Node.js", "Twilio", "Google Maps API", "Material-UI"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/restaurant-booking",
            "github_url": "",
            "case_study_content": "Developed an intuitive restaurant booking system with real-time availability checking, table management, automated SMS/email confirmations using Twilio, customer database with preferences, waitlist management, special occasion handling, and comprehensive analytics for restaurant owners. Reduced no-shows by 60% and increased bookings by 120%.",
            "status": "completed",
            "client_name": "Gourmet Restaurant Chain",
            "completion_date": "2024-08",
            "metrics": {
                "bookings": "120% increase",
                "no-shows": "60% reduction",
                "satisfaction": "4.8/5 rating"
            }
        },
        {
            "title": "SaaS Landing Page",
            "slug": "saas-landing-page",
            "category": "SaaS",
            "description": "Conversion-optimized landing page for a SaaS product with stunning animations, pricing tables, feature showcases, customer testimonials, and lead capture forms.",
            "image_url": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop",
            "tech_stack": ["React", "Next.js", "Tailwind CSS", "Framer Motion", "TypeScript", "Vercel"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/saas-landing",
            "github_url": "",
            "case_study_content": "Designed and built a high-converting SaaS landing page with smooth scroll animations, interactive feature demos, pricing calculator, customer testimonials with video, trust badges, FAQ section with smooth expand/collapse, and multi-step signup form. Achieved 35% conversion rate through A/B testing and optimization.",
            "status": "completed",
            "client_name": "CloudSync Technologies",
            "completion_date": "2024-07",
            "metrics": {
                "conversion": "35% rate",
                "signups": "500+ monthly",
                "bounce": "20% reduction"
            }
        },
        {
            "title": "Mobile Design System",
            "slug": "mobile-design-system",
            "category": "Mobile",
            "description": "Comprehensive mobile-first design system with reusable components, design tokens, and interactive documentation. Perfect for building consistent mobile applications.",
            "image_url": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop",
            "tech_stack": ["Figma", "React Native", "TypeScript", "Storybook", "Styled Components"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/mobile-design",
            "github_url": "",
            "case_study_content": "Created a complete mobile design system including 50+ reusable components, design tokens for colors/spacing/typography, interactive Storybook documentation, accessibility guidelines, dark mode support, and responsive patterns. Used by 15+ development teams to build consistent mobile experiences. Reduced design-to-development time by 40%.",
            "status": "completed",
            "client_name": "Mobile First Inc.",
            "completion_date": "2024-06",
            "metrics": {
                "components": "50+",
                "teams": "15 using it",
                "speed": "40% faster dev"
            }
        },
        {
            "title": "Real-Time Analytics Dashboard",
            "slug": "real-time-analytics-dashboard",
            "category": "Dashboard",
            "description": "Enterprise-grade analytics dashboard with real-time data visualization, custom reports, and predictive analytics. Handles millions of data points with lightning-fast performance.",
            "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
            "tech_stack": ["React", "D3.js", "Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/analytics",
            "github_url": "",
            "case_study_content": "Built a powerful real-time analytics platform with interactive charts and graphs using D3.js, custom report builder, data export functionality, user behavior tracking, A/B testing analytics, conversion funnel visualization, and predictive analytics using machine learning. Processes 10M+ events daily with sub-second query times. Deployed on Kubernetes for auto-scaling.",
            "status": "completed",
            "client_name": "DataDriven Corp.",
            "completion_date": "2024-05",
            "metrics": {
                "events": "10M+ daily",
                "response": "<1 second",
                "users": "1,000+ analysts"
            }
        },
        {
            "title": "Social Media Management Tool",
            "slug": "social-media-management-tool",
            "category": "SaaS",
            "description": "All-in-one social media management platform for scheduling posts, analytics, engagement tracking, and team collaboration across multiple platforms.",
            "image_url": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
            "tech_stack": ["React", "Node.js", "MongoDB", "Redis", "Bull Queue", "Socket.io", "OAuth2"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/social-media",
            "github_url": "",
            "case_study_content": "Developed a comprehensive social media management platform with post scheduling across Facebook, Twitter, Instagram, LinkedIn, content calendar with drag-and-drop, engagement analytics with sentiment analysis, team collaboration tools, hashtag suggestions using AI, best time to post recommendations, and bulk import/export. Integrated with major social platforms using OAuth2. Serves 2,000+ businesses managing 50+ social accounts each.",
            "status": "completed",
            "client_name": "SocialBoost Agency",
            "completion_date": "2024-04",
            "metrics": {
                "businesses": "2,000+",
                "posts": "100K+ monthly",
                "engagement": "60% increase"
            }
        },
        {
            "title": "Hotel Management System",
            "slug": "hotel-management-system",
            "category": "Hospitality",
            "description": "Comprehensive hotel booking and management platform with real-time availability, reservation management, guest profiles, and analytics dashboard for hospitality businesses.",
            "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop",
            "tech_stack": ["React", "Node.js", "MongoDB", "Stripe", "Google Maps API", "Socket.io"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/hospitality",
            "github_url": "",
            "case_study_content": "Developed a full-featured hotel management system with property listings, room inventory management, real-time booking engine, dynamic pricing, guest management with profiles and preferences, automated email confirmations, payment processing with Stripe, occupancy analytics, revenue management dashboard, and multi-property support. Serves 50+ hotels with 95% booking accuracy and 99.5% uptime.",
            "status": "completed",
            "client_name": "LuxeStay Hotel Group",
            "completion_date": "2024-03",
            "metrics": {
                "hotels": "50+ properties",
                "bookings": "250K+ annually",
                "revenue": "180% increase"
            }
        }
    ]
    
    for project_data in projects_data:
        project = Project(**project_data)
        doc = project.model_dump()
        doc['created_at'] = doc['created_at'].isoformat() if hasattr(doc['created_at'], 'isoformat') else doc['created_at']
        doc['updated_at'] = doc['updated_at'].isoformat() if hasattr(doc['updated_at'], 'isoformat') else doc['updated_at']
        await projects_collection.insert_one(doc)
        print(f"  ✓ Created: {project.title}")
    
    print(f"\n✅ Successfully seeded {len(projects_data)} comprehensive portfolio projects!")
    print(f"   📊 Featured Projects: {sum(1 for p in projects_data if p['featured'])}")
    print(f"   📁 Categories: {len(set(p['category'] for p in projects_data))}")
    print(f"   🛠️  Tech Stack Items: {len(set(tech for p in projects_data for tech in p['tech_stack']))}")

async def main():
    """Main execution"""
    try:
        await seed_complete_portfolio()
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        await close_db_connection()
        print("\n✅ Database connection closed")

if __name__ == "__main__":
    asyncio.run(main())
