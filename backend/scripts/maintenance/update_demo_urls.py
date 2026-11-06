"""
Update demo URLs for Social Media Management and Analytics Dashboard projects
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
from database import projects_collection
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

async def update_demo_urls():
    """Update live_demo_url for demo projects"""
    
    # Update Social Media Management Tool
    social_media_result = await projects_collection.update_one(
        {"slug": "social-media-manager"},
        {"$set": {"live_demo_url": "/demo/social-media"}}
    )
    
    if social_media_result.modified_count > 0:
        print("✅ Updated Social Media Management Tool demo URL")
    else:
        print("⚠️  Social Media Management Tool not found or already updated")
    
    # Update Real-Time Analytics Dashboard
    analytics_result = await projects_collection.update_one(
        {"slug": "analytics-dashboard"},
        {"$set": {"live_demo_url": "/demo/analytics"}}
    )
    
    if analytics_result.modified_count > 0:
        print("✅ Updated Real-Time Analytics Dashboard demo URL")
    else:
        print("⚠️  Analytics Dashboard not found or already updated")
    
    # Verify the updates
    print("\n📋 Current demo projects:")
    demo_projects = await projects_collection.find(
        {"live_demo_url": {"$regex": "^/demo/"}}
    ).to_list(length=None)
    
    for project in demo_projects:
        print(f"  - {project['title']}: {project['live_demo_url']}")
    
    print(f"\n✅ Total demo projects with URLs: {len(demo_projects)}")

if __name__ == "__main__":
    asyncio.run(update_demo_urls())
