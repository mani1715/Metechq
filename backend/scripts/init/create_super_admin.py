#!/usr/bin/env python3
"""
Script to create super admin in the admins collection
Uses environment variables for MongoDB connection
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
from auth import hash_password
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables

async def create_super_admin():
    # Get MongoDB URI from environment
    mongodb_uri = os.environ.get('MONGODB_URI')
    db_name = os.environ.get('DB_NAME', 'mspn_dev_db')
    
    if not mongodb_uri:
        print("❌ Error: MONGODB_URI environment variable is not set!")
        print("Please set MONGODB_URI in your .env file")
        return
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(mongodb_uri)
    db = client[db_name]
    admins_collection = db['admins']
    
    # Check if super admin already exists
    existing_admin = await admins_collection.find_one({"username": "maneesh"})
    
    if existing_admin:
        print("Super admin already exists!")
        print(f"Username: {existing_admin['username']}")
        client.close()
        return
    
    # Create super admin
    admin_user = {
        "id": str(uuid.uuid4()),
        "username": "maneesh",
        "password_hash": hash_password("maneesh123"),
        "role": "super_admin",
        "permissions": {
            "canManageAdmins": True,
            "canManageAbout": True,
            "canManagePortfolio": True,
            "canManageBlogs": True,
            "canManageTestimonials": True,
            "canManageDemos": True,
            "canViewContacts": True,
            "canManageContactPage": True,
            "canManageChat": True,
            "canManageNewsletter": True,
            "canManageBookings": True,
            "canManageBookingSettings": True,
            "canManagePricing": True,
            "canViewAnalytics": True,
            "canManageClients": True,
            "canManageClientProjects": True,
            "canAccessStorage": True,
            "canManageNotes": True,
            "canManageSettings": True,
            "canViewPrivateProjects": True
        },
        "created_at": datetime.utcnow().isoformat(),
        "created_by": "system"
    }
    
    await admins_collection.insert_one(admin_user)
    print("✅ Super admin created successfully!")
    print("Username: maneesh")
    print("Password: maneesh123")
    print("\n⚠️  IMPORTANT: Change this password after first login!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_super_admin())
