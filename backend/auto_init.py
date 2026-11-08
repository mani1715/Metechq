"""
Auto-initialization script that runs on application startup
Automatically seeds portfolio projects and services if database is empty
"""
import asyncio
from datetime import datetime
import uuid

now = datetime.utcnow().isoformat()

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
        "full_description": "AISHU FOODS represents authentic culinary tradition brought into modern digital commerce. Built for food lovers and diaspora customers looking for authentic handcrafted recipes, traditional Andhra pickles, and sweets. Features responsive product showcases, streamlined shopping cart, and smooth checkout.",
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
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "studio-photography-portfolio",
        "title": "Metechq Studio | Photography & Creative Portfolio",
        "slug": "studio-photography-portfolio",
        "category": "Photography & Studio",
        "description": "Elegant studio and photography portfolio website showcasing high-resolution gallery collections, visual storytelling, and client booking.",
        "full_description": "A modern studio and photography showcase website tailored for visual artists, photographers, and studios. Highlights include dynamic photoshoot collections, client testimonials, booking inquiry forms, and lightning-fast asset loading across all viewports.",
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
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "shopify-ecommerce-platform",
        "title": "StyleHub E-Commerce Platform",
        "slug": "shopify-ecommerce-platform",
        "category": "E-commerce",
        "description": "Modern online shopping experience with seamless checkout, inventory management, and secure multi-currency payments.",
        "full_description": "StyleHub is a comprehensive e-commerce platform built for a fashion retailer featuring real-time inventory management, multi-payment gateway integration (Stripe, PayPal), advanced product filtering, and an intuitive customer checkout experience.",
        "image_url": "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
        "gallery_images": [
            "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop"
        ],
        "tech_stack": ["React", "Node.js", "Stripe", "Tailwind CSS", "MongoDB"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "/demo/ecommerce",
        "github_url": "",
        "case_study_content": "Engineered a high-conversion e-commerce platform with real-time stock updates, automated tax calculation, and synchronized checkout flows.",
        "status": "completed",
        "client": "Fashion Retail Co.",
        "client_name": "Fashion Retail Co.",
        "project_duration": "3 months",
        "team_size": "4 developers",
        "key_features": [
            "Complete product catalog with 16+ products across 4 categories",
            "Advanced filtering by category, price range, and search",
            "Product detail pages with multi-angle image zoom",
            "Persistent shopping cart and automated discounts"
        ],
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "corporate-website-redesign",
        "title": "TechVentures Inc. Corporate Website",
        "slug": "corporate-website-redesign",
        "category": "Corporate Website",
        "description": "High-performance enterprise website showcasing technology solutions, leadership team, and investor relations.",
        "full_description": "A complete redesign of TechVentures' digital brand presence. Features interactive capability showcases, investor documentation portals, dynamic case study highlights, and bilingual localization.",
        "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        "gallery_images": [
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
        ],
        "tech_stack": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "/demo/corporate",
        "github_url": "",
        "case_study_content": "Modernized an enterprise legacy site into a fast, accessible, and responsive corporate hub with 99+ Lighthouse performance score.",
        "status": "completed",
        "client": "TechVentures Inc.",
        "client_name": "TechVentures Inc.",
        "project_duration": "2 months",
        "team_size": "3 developers",
        "key_features": [
            "Company statistics with animated counter metrics",
            "Executive leadership profiles with interactive bios",
            "Enterprise solution comparison tables",
            "Integrated press release and investor resource center"
        ],
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "analytics-dashboard",
        "title": "Analytics Dashboard Pro",
        "slug": "analytics-dashboard",
        "category": "Dashboard",
        "description": "Real-time business intelligence and data visualization platform with customizable widgets and export capabilities.",
        "full_description": "A comprehensive SaaS business analytics dashboard built for enterprise teams. Displays real-time revenue velocity, conversion funnels, churn prediction, and cohort analysis with interactive Recharts charts.",
        "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        "gallery_images": [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
        ],
        "tech_stack": ["React", "FastAPI", "Recharts", "Tailwind CSS", "MongoDB"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "/demo/analytics",
        "github_url": "",
        "case_study_content": "Designed and developed an end-to-end data reporting dashboard capable of aggregating 1M+ daily telemetry events with sub-second response times.",
        "status": "completed",
        "client": "DataMetrics Global",
        "client_name": "DataMetrics Global",
        "project_duration": "4 months",
        "team_size": "3 developers",
        "key_features": [
            "Real-time event streaming and metric cards",
            "Dynamic chart timeframes (7d, 30d, 90d, custom)",
            "Automated PDF and CSV report exporting",
            "Role-based access control and team workspace sharing"
        ],
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "mobile-app-design-system",
        "title": "FitLife Mobile App Design System",
        "slug": "mobile-app-design-system",
        "category": "UI/UX Design",
        "description": "Design system and cross-platform UI component library for health and wellness tracking applications.",
        "full_description": "A multi-theme design system and UI toolkit crafted for fitness and health monitoring applications. Includes 120+ modular UI components, workout tracking graphs, and nutrition logging interfaces.",
        "image_url": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
        "gallery_images": [
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=600&fit=crop"
        ],
        "tech_stack": ["Figma", "React Native", "Tailwind CSS", "Storybook", "TypeScript"],
        "featured": False,
        "is_private": False,
        "live_demo_url": "/demo/fitness-app",
        "github_url": "",
        "case_study_content": "Unified brand design tokens, typography scales, and accessible color palettes into an atomic design system adopted across web and mobile clients.",
        "status": "completed",
        "client": "FitLife Tech",
        "client_name": "FitLife Tech",
        "project_duration": "3 months",
        "team_size": "2 designers",
        "key_features": [
            "Atomic design token architecture across light and dark modes",
            "Workout routine planners and calendar visualizations",
            "Biometric heart-rate and step counter integration widgets",
            "Comprehensive Storybook documentation and living styleguide"
        ],
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "restaurant-booking-platform",
        "title": "Restaurant Booking Platform",
        "slug": "restaurant-booking-platform",
        "category": "Web Application",
        "description": "Real-time restaurant reservation system with table allocation, SMS confirmations, and digital menus.",
        "full_description": "An end-to-end table reservation and dining management platform. Connects diner booking flows with back-of-house table layout management, automated confirmation notifications, and customer review tracking.",
        "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        "gallery_images": [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
        ],
        "tech_stack": ["React", "FastAPI", "MongoDB", "Twilio", "Tailwind CSS"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "/demo/restaurant",
        "github_url": "",
        "case_study_content": "Reduced table booking no-shows by 45% with automated reminder notifications and real-time floor plan seating synchronization.",
        "status": "completed",
        "client": "Gourmet Hospitality Group",
        "client_name": "Gourmet Hospitality Group",
        "project_duration": "3 months",
        "team_size": "3 developers",
        "key_features": [
            "Interactive floor plan table selection",
            "Real-time slot availability without double booking",
            "Automated confirmation and reminder SMS / emails",
            "Digital menu viewer with dietary restriction filters"
        ],
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "saas-landing-page",
        "title": "TaskFlow Pro - SaaS Product Landing Page",
        "slug": "saas-landing-page",
        "category": "Landing Page",
        "description": "High-converting SaaS product marketing page with interactive product tour, pricing calculator, and lead capture.",
        "full_description": "A conversion-optimized SaaS product landing page designed to communicate value proposition, display interactive workflow demos, and guide prospects through tiered subscription pricing.",
        "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
        "gallery_images": [
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop"
        ],
        "tech_stack": ["React", "Tailwind CSS", "Framer Motion", "Vite", "Stripe"],
        "featured": False,
        "is_private": False,
        "live_demo_url": "/demo/saas-landing",
        "github_url": "",
        "case_study_content": "Achieved a 34% increase in signup conversion rate by streamlining the feature demonstration and adding interactive monthly/annual pricing toggles.",
        "status": "completed",
        "client": "TaskFlow Software",
        "client_name": "TaskFlow Software",
        "project_duration": "1 month",
        "team_size": "2 developers",
        "key_features": [
            "Interactive product workflow demonstration simulator",
            "Tiered billing pricing calculator with annual discount toggle",
            "Customer social proof section with verified case studies",
            "A/B test ready hero section with lead capture forms"
        ],
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "real-estate-portal",
        "title": "Real Estate Listing Portal",
        "slug": "real-estate-portal",
        "category": "Web Application",
        "description": "Property listing and brokerage platform with interactive maps, virtual tours, and agent scheduling.",
        "full_description": "A comprehensive real estate portal connecting property buyers, sellers, and licensed agents. Offers filterable property search, neighborhood crime/school data integration, virtual tour embeds, and private viewing appointments.",
        "image_url": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
        "gallery_images": [
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
        ],
        "tech_stack": ["React", "FastAPI", "Mapbox", "MongoDB", "Cloudinary"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "/demo/real-estate",
        "github_url": "",
        "case_study_content": "Engineered a lightning-fast property search with Mapbox cluster markers, polygon boundary filtering, and automated mortgage calculation tools.",
        "status": "completed",
        "client": "PrimeEstates Realty",
        "client_name": "PrimeEstates Realty",
        "project_duration": "4 months",
        "team_size": "4 developers",
        "key_features": [
            "Interactive Mapbox property locator with price clusters",
            "Comprehensive filter engine (beds, baths, square footage, amenities)",
            "Mortgage and monthly payment estimate calculators",
            "Agent contact and showing schedule booking form"
        ],
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "educational-lms-platform",
        "title": "EduLearn - Educational LMS Platform",
        "slug": "educational-lms-platform",
        "category": "Web Application",
        "description": "Learning management system with video courses, interactive quizzes, progress tracking, and certificate issuance.",
        "full_description": "EduLearn is a modern, scalable learning management system serving students globally. Features video courses with chapters, in-video notes, quiz evaluations, instructor discussion boards, and automated course completion certificates.",
        "image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
        "gallery_images": [
            "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop"
        ],
        "tech_stack": ["React", "FastAPI", "MongoDB", "Video.js", "Tailwind CSS"],
        "featured": True,
        "is_private": False,
        "live_demo_url": "/demo/lms",
        "github_url": "",
        "case_study_content": "Built to support concurrent student video streaming with bandwidth-adaptive video playback, chapter bookmarking, and automated certification workflows.",
        "status": "completed",
        "client": "EduLearn Academy",
        "client_name": "EduLearn Academy",
        "project_duration": "5 months",
        "team_size": "5 developers",
        "key_features": [
            "Interactive video curriculum player with chapter navigation",
            "Real-time learner progress tracking and quiz assessments",
            "Discussion forums for student-instructor engagement",
            "Automated PDF certificate generation upon course completion"
        ],
        "created_at": now,
        "updated_at": now
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
