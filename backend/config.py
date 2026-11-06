import os
import logging
from pathlib import Path
from dotenv import load_dotenv

logger = logging.getLogger("metechq.config")

# Load .env file
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
IS_PRODUCTION = ENVIRONMENT in ["production", "prod"]

# Insecure placeholder keys that must NEVER be used in production
INSECURE_SECRETS = {
    "your-secret-key-change-in-production",
    "your-secret-key",
    "secret",
    "change-me",
    "changeme",
    "admin123",
    "123456",
}

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "").strip()
MONGODB_URI = os.getenv("MONGODB_URI", "").strip()
DB_NAME = os.getenv("DB_NAME", "mspn_dev_db").strip()
PORT = int(os.getenv("PORT", 8002))
HOST = os.getenv("HOST", "127.0.0.1")
TRUST_PROXY = os.getenv("TRUST_PROXY", "false").lower() == "true"
CORS_ORIGINS_RAW = os.getenv("CORS_ORIGINS", "")

# Base upload directory
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(ROOT_DIR / "uploads"))).resolve()

# Super admin bootstrap password from environment
INIT_SUPERADMIN_PASSWORD = os.getenv("INIT_SUPERADMIN_PASSWORD", "").strip()

def get_jwt_secret() -> str:
    """Returns the validated JWT secret key with fallback protection"""
    if JWT_SECRET_KEY:
        return JWT_SECRET_KEY
    if IS_PRODUCTION:
        raise ValueError("CRITICAL: JWT_SECRET_KEY is missing in production environment!")
    # Development-only deterministic secret
    return "metechq-development-only-jwt-secret-key-minimum-32-chars-long"

def get_allowed_origins() -> list:
    """Parses and returns allowed CORS origins"""
    default_dev_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3003",
    ]
    origins = []
    if CORS_ORIGINS_RAW:
        for orig in CORS_ORIGINS_RAW.split(","):
            orig = orig.strip()
            if orig and orig not in origins:
                origins.append(orig)
    if not IS_PRODUCTION:
        for orig in default_dev_origins:
            if orig not in origins:
                origins.append(orig)
    return origins

def validate_config():
    """Validates configuration at startup"""
    errors = []
    if not MONGODB_URI:
        errors.append("MONGODB_URI is required and cannot be empty.")
    
    if not JWT_SECRET_KEY:
        if IS_PRODUCTION:
            errors.append("JWT_SECRET_KEY is required in production and cannot be empty.")
        else:
            logger.warning("⚠️  JWT_SECRET_KEY is not set in development. Using development fallback key.")
    elif JWT_SECRET_KEY.lower() in INSECURE_SECRETS:
        if IS_PRODUCTION:
            errors.append("Insecure JWT_SECRET_KEY detected in production! Please generate a strong 256-bit secret.")
        else:
            logger.warning("⚠️  Insecure JWT_SECRET_KEY in development environment.")
    
    if errors:
        error_msg = " | ".join(errors)
        logger.error(f"❌ Configuration Validation Failed: {error_msg}")
        raise ValueError(f"Configuration Validation Failed: {error_msg}")
    
    # Ensure upload directory exists
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    logger.info(f"✅ Configuration validated successfully (Env: {ENVIRONMENT})")
