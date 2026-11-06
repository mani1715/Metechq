from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import sys
import os
import logging
from pathlib import Path
from urllib.parse import quote_plus

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# ---------------- LOGGING ----------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------- ENV LOADING ----------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ---------------- ENV VARIABLES ----------------
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "mspn_dev_db")

if not MONGODB_URI:
    logger.error("❌ MONGODB_URI is missing!")
    raise ValueError("MONGODB_URI environment variable is required.")

# ---------------- SAFE URI HANDLING ----------------
def build_safe_mongo_uri(uri: str) -> str:
    """
    Escapes username & password in MongoDB URI safely
    """
    if "@@" in uri:
        raise ValueError("Invalid MongoDB URI")

    if "@" not in uri:
        return uri  # no credentials

    protocol, rest = uri.split("://", 1)
    creds, host = rest.split("@", 1)

    if ":" in creds:
        username, password = creds.split(":", 1)
        username = quote_plus(username)
        password = quote_plus(password)
        return f"{protocol}://{username}:{password}@{host}"

    return uri

SAFE_MONGODB_URI = build_safe_mongo_uri(MONGODB_URI)

# ---------------- CONNECTION ----------------
try:
    logger.info("🔗 Connecting to MongoDB...")
    client = AsyncIOMotorClient(
        SAFE_MONGODB_URI,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
    )
    db = client[DB_NAME]
    logger.info(f"✅ MongoDB connected | DB: {DB_NAME}")
except Exception as e:
    logger.error(f"❌ MongoDB connection failed: {e}")
    raise

# ---------------- COLLECTIONS ----------------
users_collection = db["users"]
page_content_collection = db["page_content"]
services_collection = db["services"]
projects_collection = db["projects"]
contacts_collection = db["contacts"]
settings_collection = db["settings"]
admins_collection = db["admins"]
storage_collection = db["storage"]
skills_collection = db["skills"]
content_collection = db["content"]
notes_collection = db["notes"]
contact_page_collection = db["contact_page"]
conversations_collection = db["conversations"]
blogs_collection = db["blogs"]
testimonials_collection = db["testimonials"]
newsletter_collection = db["newsletter"]
pricing_collection = db["pricing"]
analytics_collection = db["analytics"]
clients_collection = db["clients"]
client_projects_collection = db["client_projects"]
bookings_collection = db["bookings"]
booking_settings_collection = db["booking_settings"]

# ---------------- CLEAN SHUTDOWN ----------------
async def close_db_connection():
    logger.info("🔌 Closing MongoDB connection...")
    client.close()
