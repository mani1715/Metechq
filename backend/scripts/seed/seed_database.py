"""
Seed script to populate the database with initial data from mock data
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

# Add parent directory to path to import modules

from database import (
    users_collection,
    page_content_collection,
    services_collection,
    projects_collection,
    contacts_collection,
    settings_collection,
    close_db_connection
)
from auth import hash_password
from models import User, Service, Project, ContactSubmission, Settings, PageContent

async def seed_admin_user():
    """Create default admin user"""
    print("Seeding admin user...")
    
    # Check if admin already exists
    existing = await users_collection.find_one({"email": "admin@mspndev.com"})
    if existing:
        print("Admin user already exists, skipping...")
        return
    
    import secrets
    admin_pass = os.environ.get("INIT_SUPERADMIN_PASSWORD") or secrets.token_urlsafe(16)
    admin = User(
        name="Admin",
        email="admin@metechq.com",
        password_hash=hash_password(admin_pass),
        role="admin"
    )
    
    admin_dict = admin.model_dump()
    admin_dict['created_at'] = admin_dict['created_at'].isoformat()
    
    await users_collection.insert_one(admin_dict)
    print(f"✓ Created admin user: {admin.email}")
    print(f"  Password: {admin_pass}")

async def seed_services():
    """Seed initial services"""
    print("Seeding services...")
    
    # Clear existing services
    await services_collection.delete_many({})
    
    services_data = [
        {
            "title": "Web Development",
            "description": "Custom websites and web applications built with modern technologies",
            "icon": "Code",
            "features": ["Responsive Design", "SEO Optimized", "Fast Performance", "Secure & Scalable"],
            "price": "Starting at $2,999",
            "active": True,
            "order": 1
        },
        {
            "title": "E-commerce Solutions",
            "description": "Complete online store solutions with payment integration and inventory management",
            "icon": "ShoppingCart",
            "features": ["Payment Integration", "Inventory Management", "Order Tracking", "Admin Dashboard"],
            "price": "Starting at $4,999",
            "active": True,
            "order": 2
        },
        {
            "title": "UI/UX Design",
            "description": "Beautiful, intuitive interfaces that provide excellent user experience",
            "icon": "Palette",
            "features": ["User Research", "Wireframing", "Prototyping", "Design Systems"],
            "price": "Starting at $1,999",
            "active": True,
            "order": 3
        },
        {
            "title": "Mobile App Development",
            "description": "Native and cross-platform mobile applications for iOS and Android",
            "icon": "Smartphone",
            "features": ["iOS & Android", "Cross-platform", "Push Notifications", "Offline Support"],
            "price": "Starting at $5,999",
            "active": True,
            "order": 4
        }
    ]
    
    for service_data in services_data:
        service = Service(**service_data)
        doc = service.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await services_collection.insert_one(doc)
        print(f"✓ Created service: {service.title}")

async def seed_projects():
    """Seed initial projects"""
    print("Seeding projects...")
    
    # Clear existing projects
    await projects_collection.delete_many({})
    
    projects_data = [
        {
            "title": "E-commerce Platform",
            "slug": "ecommerce-platform",
            "category": "E-commerce",
            "description": "A modern e-commerce platform with shopping cart, checkout, and payment integration",
            "image_url": "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
            "tech_stack": ["React", "Node.js", "MongoDB", "Stripe"],
            "featured": True,
            "live_demo_url": "/demo/ecommerce",
            "case_study_content": "Built a complete e-commerce solution with product catalog, shopping cart, and secure checkout.",
            "status": "completed"
        },
        {
            "title": "Corporate Website",
            "slug": "corporate-website",
            "category": "Corporate",
            "description": "Professional corporate website with team profiles and service showcases",
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
            "tech_stack": ["React", "Tailwind CSS"],
            "featured": True,
            "live_demo_url": "/demo/corporate",
            "case_study_content": "Designed and developed a professional corporate website with modern UI/UX.",
            "status": "completed"
        },
        {
            "title": "Learning Management System",
            "slug": "learning-management-system",
            "category": "Education",
            "description": "Comprehensive LMS platform for online courses and learning",
            "image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
            "tech_stack": ["React", "FastAPI", "PostgreSQL"],
            "featured": True,
            "live_demo_url": "/demo/lms",
            "case_study_content": "Created a full-featured learning management system with course management and student tracking.",
            "status": "completed"
        },
        {
            "title": "Restaurant Booking System",
            "slug": "restaurant-booking",
            "category": "Hospitality",
            "description": "Online reservation system for restaurants with table management",
            "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
            "tech_stack": ["React", "Firebase"],
            "featured": False,
            "live_demo_url": "/demo/restaurant-booking",
            "case_study_content": "Developed a restaurant booking system with real-time availability.",
            "status": "completed"
        },
        {
            "title": "SaaS Landing Page",
            "slug": "saas-landing",
            "category": "SaaS",
            "description": "Modern SaaS landing page with pricing and feature showcase",
            "image_url": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800",
            "tech_stack": ["React", "Tailwind CSS", "Framer Motion"],
            "featured": False,
            "live_demo_url": "/demo/saas-landing",
            "case_study_content": "Designed a conversion-focused SaaS landing page with animations.",
            "status": "completed"
        }
    ]
    
    for project_data in projects_data:
        project = Project(**project_data)
        doc = project.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await projects_collection.insert_one(doc)
        print(f"✓ Created project: {project.title}")

async def seed_settings():
    """Seed initial settings"""
    print("Seeding settings...")
    
    # Clear existing settings
    await settings_collection.delete_many({})
    
    settings = Settings(
        agency_name="METECHQ",
        owner_name="Maneesh",
        email="info@mspndev.com",
        phone="+1234567890",
        address="123 Main Street, City, Country",
        description="Professional web development agency specializing in modern web applications",
        tagline="Building Digital Excellence",
        social_links={
            "facebook": "https://facebook.com/mspndev",
            "twitter": "https://twitter.com/mspndev",
            "linkedin": "https://linkedin.com/company/mspndev",
            "instagram": "https://instagram.com/mspndev",
            "github": "https://github.com/mspndev"
        },
        theme={
            "primary": "#1C2A3A",
            "secondary": "#D4AF37",
            "accent": "#7C5CFF"
        }
    )
    
    settings_dict = settings.model_dump()
    settings_dict['updated_at'] = settings_dict['updated_at'].isoformat()
    
    await settings_collection.insert_one(settings_dict)
    print(f"✓ Created settings for: {settings.agency_name}")

async def seed_page_content():
    """Seed initial page content"""
    print("Seeding page content...")
    
    # Clear existing page content
    await page_content_collection.delete_many({})
    
    # Home page content
    home_sections = {
        "hero": {
            "badge": "Professional Web Development",
            "headline": "Building Digital Excellence",
            "subheadline": "Transform Your Ideas Into Reality",
            "description": "We create stunning, functional websites and applications that help businesses thrive in the digital world.",
            "cta1Text": "View Portfolio",
            "cta1Link": "/portfolio",
            "cta2Text": "Contact Us",
            "cta2Link": "/contact"
        },
        "stats": {
            "visible": True,
            "stat1": "50+",
            "stat1Label": "Projects Completed",
            "stat2": "98%",
            "stat2Label": "Client Satisfaction",
            "stat3": "5+",
            "stat3Label": "Years Experience"
        },
        "services": {
            "visible": True,
            "title": "Our Services",
            "description": "Comprehensive web development solutions tailored to your needs"
        },
        "portfolio": {
            "visible": True,
            "title": "Featured Projects",
            "description": "Showcasing our best work"
        }
    }
    
    for section, content in home_sections.items():
        page_content = PageContent(
            page="home",
            section=section,
            content=content,
            visible=True
        )
        doc = page_content.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await page_content_collection.insert_one(doc)
    
    print(f"✓ Created home page content")
    
    # About page content
    about_sections = {
        "hero": {
            "title": "About Us",
            "description": "Learn more about our journey and mission"
        },
        "mission": {
            "title": "Our Mission",
            "content": "To deliver exceptional web solutions that empower businesses to succeed in the digital age."
        },
        "vision": {
            "title": "Our Vision",
            "content": "To be the leading web development agency known for innovation, quality, and client satisfaction."
        }
    }
    
    for section, content in about_sections.items():
        page_content = PageContent(
            page="about",
            section=section,
            content=content,
            visible=True
        )
        doc = page_content.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await page_content_collection.insert_one(doc)
    
    print(f"✓ Created about page content")

async def seed_sample_contacts():
    """Seed sample contact submissions"""
    print("Seeding sample contacts...")
    
    # Clear existing contacts
    await contacts_collection.delete_many({})
    
    contacts_data = [
        {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890",
            "service": "Web Development",
            "message": "I'm interested in building a new website for my business.",
            "read": False
        },
        {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "phone": "+1987654321",
            "service": "E-commerce Solutions",
            "message": "Looking for an e-commerce platform with payment integration.",
            "read": True
        }
    ]
    
    for contact_data in contacts_data:
        contact = ContactSubmission(**contact_data)
        doc = contact.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await contacts_collection.insert_one(doc)
        print(f"✓ Created contact from: {contact.name}")

async def main():
    """Run all seed functions"""
    print("\n🌱 Starting database seeding...\n")
    
    try:
        await seed_admin_user()
        await seed_services()
        await seed_projects()
        await seed_settings()
        await seed_page_content()
        await seed_sample_contacts()
        
        print("\n✅ Database seeding completed successfully!\n")
        print("Admin Login Credentials:")
        print("  Email: admin@metechq.com")
        print("  Password: <configured via INIT_SUPERADMIN_PASSWORD>\n")
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}\n")
    finally:
        await close_db_connection()

if __name__ == "__main__":
    asyncio.run(main())
