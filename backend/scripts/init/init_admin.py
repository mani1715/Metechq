#!/usr/bin/env python3
"""
Automatic admin initialization script
Run this on startup to ensure admin exists
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
from motor.motor_asyncio import AsyncIOMotorClient
from auth.password import hash_password
import uuid
from datetime import datetime
import os

async def init_admin():
    """Initialize admin user if not exists"""
    try:
        # Connect to MongoDB
        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        db_name = os.environ.get('DB_NAME', 'test_database')
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        admins_collection = db['admins']
        
        # Check if any super admin exists
        existing_admin = await admins_collection.find_one({"role": "super_admin"})
        
        if existing_admin:
            print("✅ Super admin already exists")
            client.close()
            return
        
        # Create default super admin
        admin_user = {
            "id": str(uuid.uuid4()),
            "username": "admin",
            "password_hash": hash_password("admin123"),
            "role": "super_admin",
            "permissions": {
                "canManageAdmins": True,
                "canViewPrivateProjects": True,
                "canAccessPrivateStorage": True,
                "canAccessChat": True
            },
            "created_at": datetime.utcnow().isoformat(),
            "created_by": "system"
        }
        
        await admins_collection.insert_one(admin_user)
        print("✅ Super admin created successfully!")
        print(f"Username: admin")
        print(f"Password: admin123")
        print("\n⚠️  IMPORTANT: Please change this password after first login!")
        print("    Go to Admin Panel -> Settings to change your password")
        
        client.close()
        
    except Exception as e:
        print(f"❌ Error initializing admin: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(init_admin())
