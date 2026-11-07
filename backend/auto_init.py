"""
Auto-initialization script that runs on application startup
Automatically seeds portfolio projects and services if database is empty
"""
import asyncio
from datetime import datetime
import uuid

# =========================
# PORTFOLIO PROJECTS
# =========================
PORTFOLIO_PROJECTS = [
    {
        "id": "aishu-foods-ecommerce",
        "title": "AISHU FOODS | Authentic Delicacies & E-Commerce Platform",
        "slug": "aishu-foods-ecommerce",
        "category": "E-commerce",
        "description": "Handcrafted authentic delicacies, traditional Andhra pickles, and pure ghee sweets with seamless online ordering.",
        "full_description": "AISHU FOODS is an authentic e-commerce brand offering handcrafted delicacies, traditional Andhra pickles, and pure ghee sweets. Features responsive product showcases, streamlined shopping cart, and smooth checkout.",
        "image_url": "/images/projects/aishufoods-cover.png",
        "gallery_images": ["/images/projects/aishufoods-cover.png"],
        "tech_stack": ["E-Commerce", "React", "Node.js", "Payment Gateway", "Order Tracking"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "https://aishufoods.com/",
        "github_url": "",
        "case_study_content": "AISHU FOODS brings traditional culinary heritage to digital commerce. Engineered for high performance, intuitive product browsing, and mobile-friendly shopping.",
        "status": "completed",
        "client": "Aishu Foods",
        "client_name": "Aishu Foods",
        "project_duration": "4 months",
        "team_size": "3 developers",
        "key_features": [
            "Authentic traditional delicacies and pickle catalog",
            "Streamlined product browsing with high-resolution imagery",
            "Mobile-optimized shopping cart and checkout",
            "Integrated secure payment options and order fulfillment"
        ],
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": "studio-photography-portfolio",
        "title": "Metechq Studio | Photography & Creative Portfolio",
        "slug": "studio-photography-portfolio",
        "category": "Photography & Studio",
        "description": "Elegant studio and photography portfolio website showcasing high-resolution gallery collections, visual storytelling, and client booking.",
        "full_description": "A modern studio and photography website designed for creative professionals and visual studios. Features responsive image galleries, visual storytelling sections, and client booking inquiries.",
        "image_url": "/images/projects/studio-website-cover.png",
        "gallery_images": ["/images/projects/studio-website-cover.png"],
        "tech_stack": ["React", "Tailwind CSS", "Portfolio", "Responsive Web Design"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "https://studio-website-orcin-five.vercel.app/",
        "github_url": "",
        "case_study_content": "Developed for photographers and creative visual studios, emphasizing aesthetics, fast asset loading, and seamless navigation across all devices.",
        "status": "completed",
        "client": "Studio & Photography Sample",
        "client_name": "Creative Studio",
        "project_duration": "2 months",
        "team_size": "2 developers",
        "key_features": [
            "Curated photo galleries with responsive grid layouts",
            "High-speed image loading and smooth transitions",
            "Service packages showcase and appointment booking inquiries",
            "Client testimonials and behind-the-scenes portfolio storytelling"
        ],
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "StyleHub E-Commerce Platform",
        "slug": "stylehub-ecommerce",
        "category": "E-commerce",
        "description": "Modern online shopping experience with seamless checkout and secure payments.",
        "full_description": "StyleHub is a comprehensive e-commerce platform with real-time inventory, Stripe payments, and admin dashboard.",
        "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60",
        "tech_stack": ["React", "Node.js", "Stripe", "MongoDB"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "/demo/ecommerce",
        "github_url": "",
        "case_study_content": "Built a full-featured e-commerce platform.",
        "status": "completed",
        "client": "StyleHub",
        "duration": "3 months",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
]

# =========================
# SERVICES DATA
# =========================
SERVICES_DATA = [
    {
        "id": str(uuid.uuid4()),
        "title": "Web Development",
        "slug": "web-development",
        "description": "Custom full-stack web applications.",
        "icon": "code",
        "features": [
            "Custom Web Apps",
            "API Development",
            "Cloud Deployment"
        ],
        "price_range": "$5000 - $50000",
        "price": "$5000 - $50000",
        "active": True,
        "order": 1,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
]

# =========================
# AUTO INIT FUNCTION
# =========================
async def auto_initialize_database():
    """
    Automatically seed portfolio projects and services
    if collections are empty.
    """
    try:
        from database import projects_collection, services_collection

        # Seed projects
        projects_count = await projects_collection.count_documents({})
        if projects_count == 0:
            print("📦 No projects found. Seeding portfolio projects...")
            await projects_collection.insert_many(PORTFOLIO_PROJECTS)
            print(f"✅ Seeded {len(PORTFOLIO_PROJECTS)} projects")
        else:
            print(f"✅ Projects already exist ({projects_count})")

        # Seed services
        services_count = await services_collection.count_documents({})
        if services_count == 0:
            print("📦 No services found. Seeding services...")
            await services_collection.insert_many(SERVICES_DATA)
            print(f"✅ Seeded {len(SERVICES_DATA)} services")
        else:
            print(f"✅ Services already exist ({services_count})")

        print("🎉 Auto-initialization complete")
        return True

    except Exception as e:
        print(f"❌ Auto-init error: {str(e)}")
        return False


if __name__ == "__main__":
    asyncio.run(auto_initialize_database())
