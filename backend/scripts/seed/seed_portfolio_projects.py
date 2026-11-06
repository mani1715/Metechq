"""
Seed Portfolio Projects with Professional Images
Run this script to add sample portfolio projects with images
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

# Add parent directory to path to import from backend

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime

# Load environment
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "mspn_dev_db")

# Portfolio projects with professional images from Unsplash
PORTFOLIO_PROJECTS = [
    {
        "id": str(uuid.uuid4()),
        "title": "StyleHub E-Commerce Platform",
        "slug": "stylehub-ecommerce",
        "category": "E-commerce",
        "description": "Modern online shopping experience with seamless checkout, secure payments, and intuitive product browsing. Built with React and Node.js.",
        "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60",
        "tech_stack": ["React", "Node.js", "Stripe", "MongoDB", "Express"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "/demo/ecommerce",
        "case_study_content": "Built a full-featured e-commerce platform with cart, wishlist, payment integration, and order management.",
        "status": "completed",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "TechCorp Business Website",
        "slug": "techcorp-business",
        "category": "Corporate",
        "description": "Professional corporate website with dynamic content management, blog, and contact forms. Optimized for SEO and performance.",
        "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
        "tech_stack": ["React", "FastAPI", "PostgreSQL", "Tailwind CSS"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "/demo/corporate",
        "case_study_content": "Delivered a sleek corporate website with CMS integration, blog management, and advanced analytics.",
        "status": "completed",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "FoodHub Restaurant Platform",
        "slug": "foodhub-restaurant",
        "category": "Restaurant",
        "description": "Online food ordering system with menu management, order tracking, and payment integration. Mobile-responsive design.",
        "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
        "tech_stack": ["React", "Node.js", "MongoDB", "Stripe", "Socket.io"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "/demo/restaurant-booking",
        "case_study_content": "Created an intuitive restaurant platform with real-time order tracking and seamless payment processing.",
        "status": "completed",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "PropFinder Real Estate Portal",
        "slug": "propfinder-real-estate",
        "category": "Real Estate",
        "description": "Property listing platform with advanced search, filters, virtual tours, and agent management. Beautiful UI with map integration.",
        "image_url": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60",
        "tech_stack": ["React", "Node.js", "MongoDB", "Google Maps API", "AWS S3"],
        "featured": False,
        "is_private": False,
        "live_demo_url": "/demo/real-estate",
        "case_study_content": "Developed a comprehensive real estate portal with property listings, advanced search, and virtual tour integration.",
        "status": "completed",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "EduLearn Online Learning Platform",
        "slug": "edulearn-lms",
        "category": "Education",
        "description": "Complete Learning Management System with course creation, video streaming, quizzes, and progress tracking for students.",
        "image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=60",
        "tech_stack": ["React", "FastAPI", "PostgreSQL", "AWS S3", "Redis"],
        "featured": False,
        "is_private": False,
        "live_demo_url": "/demo/lms",
        "case_study_content": "Built a full-featured LMS with video hosting, quiz management, and student progress analytics.",
        "status": "completed",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "HealthCare Patient Portal",
        "slug": "healthcare-patient-portal",
        "category": "Healthcare",
        "description": "Secure patient portal for appointment booking, medical records, and doctor consultations. HIPAA compliant design.",
        "image_url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=60",
        "tech_stack": ["React", "Node.js", "MongoDB", "WebRTC", "Stripe"],
        "featured": False,
        "is_private": False,
        "live_demo_url": None,
        "case_study_content": "Created a secure healthcare portal with appointment scheduling, video consultations, and medical record management.",
        "status": "completed",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "FitTrack Fitness App",
        "slug": "fittrack-fitness",
        "category": "Fitness",
        "description": "Personal fitness tracking application with workout plans, nutrition tracking, and progress analytics. Social features included.",
        "image_url": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60",
        "tech_stack": ["React Native", "Node.js", "MongoDB", "Chart.js"],
        "featured": False,
        "is_private": False,
        "live_demo_url": None,
        "case_study_content": "Developed a comprehensive fitness app with workout tracking, meal planning, and social sharing features.",
        "status": "completed",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "TravelHub Booking Platform",
        "slug": "travelhub-booking",
        "category": "Travel",
        "description": "Travel booking platform with flight, hotel, and tour package reservations. Real-time availability and pricing.",
        "image_url": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=60",
        "tech_stack": ["React", "Node.js", "PostgreSQL", "Stripe", "Google Maps"],
        "featured": False,
        "is_private": False,
        "live_demo_url": None,
        "case_study_content": "Built a travel booking platform integrating multiple APIs for flights, hotels, and tour packages.",
        "status": "completed",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "SocialConnect Dashboard",
        "slug": "socialconnect-dashboard",
        "category": "Social Media",
        "description": "Social media management dashboard with post scheduling, analytics, and multi-platform integration. Real-time metrics.",
        "image_url": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60",
        "tech_stack": ["React", "FastAPI", "MongoDB", "Redis", "Celery"],
        "featured": False,
        "is_private": False,
        "live_demo_url": "/demo/social-media",
        "case_study_content": "Developed a social media management tool with scheduling, analytics, and multi-platform posting capabilities.",
        "status": "completed",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "FinanceTracker Dashboard",
        "slug": "financetracker-dashboard",
        "category": "Finance",
        "description": "Personal finance management dashboard with expense tracking, budget planning, and financial insights. Beautiful charts.",
        "image_url": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60",
        "tech_stack": ["React", "Node.js", "MongoDB", "Chart.js", "Plaid API"],
        "featured": False,
        "is_private": False,
        "live_demo_url": "/demo/analytics",
        "case_study_content": "Created a comprehensive finance tracker with expense categorization, budget planning, and financial analytics.",
        "status": "completed",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
]

async def seed_projects():
    """Seed portfolio projects into database"""
    print("🌱 Starting portfolio projects seeding...")
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    projects_collection = db["projects"]
    
    try:
        # Clear existing projects (optional - comment out if you want to keep existing)
        print("🗑️  Clearing existing projects...")
        await projects_collection.delete_many({})
        
        # Insert new projects
        print(f"📝 Inserting {len(PORTFOLIO_PROJECTS)} portfolio projects...")
        result = await projects_collection.insert_many(PORTFOLIO_PROJECTS)
        
        print(f"✅ Successfully added {len(result.inserted_ids)} projects!")
        print("\n📊 Projects Summary:")
        print(f"   - Total projects: {len(PORTFOLIO_PROJECTS)}")
        print(f"   - Featured projects: {sum(1 for p in PORTFOLIO_PROJECTS if p['featured'])}")
        print(f"   - Public projects: {sum(1 for p in PORTFOLIO_PROJECTS if not p['is_private'])}")
        
        print("\n🎨 Project Categories:")
        categories = {}
        for project in PORTFOLIO_PROJECTS:
            cat = project['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        for cat, count in sorted(categories.items()):
            print(f"   - {cat}: {count}")
        
        print("\n✨ Sample projects added:")
        for project in PORTFOLIO_PROJECTS[:3]:
            print(f"   - {project['title']} ({project['category']})")
        
    except Exception as e:
        print(f"❌ Error seeding projects: {e}")
        raise
    finally:
        client.close()
        print("\n🔌 Database connection closed")

if __name__ == "__main__":
    print("=" * 60)
    print("Portfolio Projects Seeder")
    print("=" * 60)
    asyncio.run(seed_projects())
    print("\n✅ Seeding complete!")
    print("=" * 60)
