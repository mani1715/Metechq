from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import sys
import os
import logging
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
from database import close_db_connection

# Import all routers
from routes import (
    auth_router,
    pages_router,
    services_router,
    projects_router,
    contacts_router,
    settings_router,
    admins_router,
    storage_router,
    skills_router,
    content_router,
    notes_router,
    about_router,
    chat_router,
    blogs_router,
    newsletter_router,
    analytics_router
)
from routes.contact_page import router as contact_page_router
from routes.testimonials import router as testimonials_router
from routes.pricing import router as pricing_router

# Client Portal Routers
from routes.client_auth import router as client_auth_router
from routes.admin_clients import router as admin_clients_router
from routes.admin_client_projects import router as admin_client_projects_router
from routes.client_projects import router as client_projects_router

# Booking Routers
from routes.bookings import router as bookings_router
from routes.booking_settings import router as booking_settings_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

PORT = int(os.environ.get("PORT", 8001))

app = FastAPI(
    title="METECHQ API",
    description="Backend API for METECHQ website and admin panel",
    version="1.0.0",
    root_path="/api" if os.environ.get("TRUST_PROXY") == "true" else ""
)

# -------------------------------------------------------------------
# Proxy Header Middleware
# -------------------------------------------------------------------
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

class ProxyHeaderMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        forwarded_proto = request.headers.get("X-Forwarded-Proto")
        if forwarded_proto:
            request.scope["scheme"] = forwarded_proto

        forwarded_host = request.headers.get("X-Forwarded-Host")
        if forwarded_host:
            request.scope["server"] = (forwarded_host, None)

        return await call_next(request)

app.add_middleware(ProxyHeaderMiddleware)

cors_origins_env = os.environ.get("CORS_ORIGINS", "")
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3002",
    "http://localhost:5173",
    "https://new-159.vercel.app"
]
if cors_origins_env:
    for origin in cors_origins_env.split(","):
        origin_clean = origin.strip()
        if origin_clean and origin_clean not in ALLOWED_ORIGINS:
            ALLOWED_ORIGINS.append(origin_clean)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# Routers
# -------------------------------------------------------------------
api_router = APIRouter(prefix="/api")

@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "METECHQ API"}

@api_router.get("/")
async def root():
    return {"message": "METECHQ API is running"}

api_router.include_router(auth_router)
api_router.include_router(pages_router)
api_router.include_router(services_router)
api_router.include_router(projects_router)
api_router.include_router(contacts_router)
api_router.include_router(settings_router)
api_router.include_router(admins_router)
api_router.include_router(storage_router)
api_router.include_router(skills_router)
api_router.include_router(content_router)
api_router.include_router(notes_router)
api_router.include_router(about_router)
api_router.include_router(contact_page_router)
api_router.include_router(chat_router)
api_router.include_router(blogs_router)
api_router.include_router(testimonials_router, prefix="/testimonials")
api_router.include_router(newsletter_router)
api_router.include_router(pricing_router)
api_router.include_router(analytics_router)

api_router.include_router(client_auth_router)
api_router.include_router(admin_clients_router)
api_router.include_router(admin_client_projects_router)
api_router.include_router(client_projects_router)

api_router.include_router(bookings_router)
api_router.include_router(booking_settings_router)

app.include_router(api_router)

# -------------------------------------------------------------------
# Startup Initialization
# -------------------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    try:
        from auto_init import auto_initialize_database
        await auto_initialize_database()

        from database import admins_collection
        from auth.password import hash_password
        import uuid
        from datetime import datetime

        logger.info("Checking for super admin...")

        existing_admin = await admins_collection.find_one({"role": "super_admin"})

        if not existing_admin:
            admin_user = {
                "id": str(uuid.uuid4()),
                "username": "maneesh",
                "password_hash": hash_password("maneesh123"),
                "role": "super_admin",
                "permissions": {"canManageAdmins": True},
                "created_at": datetime.utcnow().isoformat(),
                "created_by": "system"
            }

            await admins_collection.insert_one(admin_user)

            logger.info("✅ Super admin created successfully!")
            logger.info("   Username: maneesh")
            logger.info("   Password: maneesh123")
            logger.info("   ⚠️ Change this password after login!")

        else:
            logger.info("✅ Super admin already exists")

    except Exception as e:
        logger.warning(f"Startup initialization failed: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db_connection()
