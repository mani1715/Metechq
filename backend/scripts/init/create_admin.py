#!/usr/bin/env python3
"""
Script to create admin user in the database
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

async def create_admin_user():
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
    users_collection = db['users']
    
    # Check if admin already exists
    existing_admin = await users_collection.find_one({"email": "admin@mspn.com"})
    
    if existing_admin:
        print("Admin user already exists!")
        print(f"Email: {existing_admin['email']}")
        client.close()
        return
    
    # Create admin user
    admin_user = {
        "id": str(uuid.uuid4()),
        "name": "Admin",
        "email": "admin@mspn.com",
        "password_hash": hash_password("admin123"),
        "role": "admin",
        "created_at": datetime.utcnow().isoformat()
    }
    
    await users_collection.insert_one(admin_user)
    print("✅ Admin user created successfully!")
    print(f"Email: admin@mspn.com")
    print(f"Password: admin123")
    print("\n⚠️  IMPORTANT: Change this password after first login!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin_user())
