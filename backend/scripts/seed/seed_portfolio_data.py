"""
Seed portfolio projects into the database
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

# Add parent directory to path

from database import projects_collection, close_db_connection
from models.project import Project

async def seed_portfolio_projects():
    """Seed portfolio projects"""
    print("🌱 Seeding portfolio projects...")
    
    # Clear existing projects
    result = await projects_collection.delete_many({})
    print(f"  Cleared {result.deleted_count} existing projects")
    
    projects_data = [
        {
            "title": "StyleHub E-Commerce Platform",
            "slug": "stylehub-ecommerce-platform",
            "category": "E-commerce",
            "description": "Modern online shopping experience with seamless checkout and secure payments. Complete e-commerce solution with product catalog, shopping cart, wishlist, and integrated payment processing.",
            "image_url": "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
            "tech_stack": ["React", "Node.js", "Stripe", "MongoDB", "Tailwind CSS"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/ecommerce",
            "github_url": "",
            "case_study_content": "Built a complete e-commerce solution with product management, shopping cart, checkout flow, and Stripe payment integration.",
            "status": "completed"
        },
        {
            "title": "Corporate Business Website",
            "slug": "corporate-business-website",
            "category": "Corporate",
            "description": "Professional business website with dynamic content management. Elegant design showcasing company services, team profiles, and client testimonials.",
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
            "tech_stack": ["React", "FastAPI", "PostgreSQL", "Tailwind CSS"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/corporate",
            "github_url": "",
            "case_study_content": "Designed and developed a professional corporate website with modern UI/UX and content management capabilities.",
            "status": "completed"
        },
        {
            "title": "Learning Management System",
            "slug": "learning-management-system",
            "category": "Education",
            "description": "Comprehensive LMS platform for online courses and learning. Features include course management, student enrollment, progress tracking, and interactive assessments.",
            "image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
            "tech_stack": ["React", "Node.js", "MongoDB", "Socket.io", "AWS"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/lms",
            "github_url": "",
            "case_study_content": "Created a full-featured learning management system with course management, student tracking, and real-time collaboration.",
            "status": "completed"
        },
        {
            "title": "Restaurant Booking System",
            "slug": "restaurant-booking-system",
            "category": "Hospitality",
            "description": "Online reservation system for restaurants with table management. Customers can view availability, book tables, and receive instant confirmation.",
            "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
            "tech_stack": ["React", "Firebase", "Stripe", "Tailwind CSS"],
            "featured": False,
            "is_private": False,
            "live_demo_url": "/demo/restaurant-booking",
            "github_url": "",
            "case_study_content": "Developed a real-time restaurant booking system with availability calendar and automated notifications.",
            "status": "completed"
        },
        {
            "title": "SaaS Landing Page",
            "slug": "saas-landing-page",
            "category": "SaaS",
            "description": "Modern SaaS product landing page with pricing tiers and feature showcases. Optimized for conversions with clear CTAs and responsive design.",
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
            "tech_stack": ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
            "featured": False,
            "is_private": False,
            "live_demo_url": "/demo/saas-landing",
            "github_url": "",
            "case_study_content": "Designed and built a high-converting SaaS landing page with animated sections and pricing calculator.",
            "status": "completed"
        },
        {
            "title": "Mobile Design System",
            "slug": "mobile-design-system",
            "category": "Mobile",
            "description": "Beautiful mobile-first design system with reusable components. Complete UI kit with interactive prototypes and design tokens.",
            "image_url": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
            "tech_stack": ["Figma", "React Native", "TypeScript", "Storybook"],
            "featured": False,
            "is_private": False,
            "live_demo_url": "/demo/mobile-design",
            "github_url": "",
            "case_study_content": "Created a comprehensive mobile design system with documented components and usage guidelines.",
            "status": "completed"
        },
        {
            "title": "Real-Time Analytics Dashboard",
            "slug": "analytics-dashboard",
            "category": "Dashboard",
            "description": "Real-time data visualization and reporting system. Interactive charts, metrics tracking, and customizable widgets for business intelligence.",
            "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
            "tech_stack": ["React", "Python", "MongoDB", "D3.js", "WebSocket"],
            "featured": False,
            "is_private": False,
            "live_demo_url": "",
            "github_url": "",
            "case_study_content": "Built a real-time analytics dashboard with live data streaming and interactive visualizations.",
            "status": "completed"
        },
        {
            "title": "Social Media Management Tool",
            "slug": "social-media-tool",
            "category": "SaaS",
            "description": "Multi-platform social media scheduling and analytics tool. Schedule posts, track engagement, and analyze performance across multiple platforms.",
            "image_url": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
            "tech_stack": ["React", "Node.js", "Redis", "MongoDB", "Twitter API"],
            "featured": False,
            "is_private": False,
            "live_demo_url": "",
            "github_url": "",
            "case_study_content": "Developed a comprehensive social media management platform with multi-account support and analytics.",
            "status": "completed"
        }
    ]
    
    # Insert projects
    for project_data in projects_data:
        project = Project(**project_data)
        doc = project.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        
        await projects_collection.insert_one(doc)
        print(f"  ✓ Created: {project.title}")
    
    print(f"✅ Successfully seeded {len(projects_data)} portfolio projects!")

async def main():
    try:
        await seed_portfolio_projects()
    except Exception as e:
        print(f"❌ Error seeding data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await close_db_connection()

if __name__ == "__main__":
    asyncio.run(main())
