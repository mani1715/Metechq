
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
import uuid
from datetime import datetime
from database import projects_collection

async def seed_demo_projects():
    """Add the two demo projects to the portfolio"""
    
    demo_projects = [
        {
            "id": str(uuid.uuid4()),
            "title": "Social Media Management Tool",
            "slug": "social-media-management-tool",
            "category": "SaaS Platform",
            "description": "A comprehensive social media management platform for scheduling posts, tracking engagement, and analyzing performance across multiple social platforms including Twitter, Instagram, LinkedIn, and Facebook.",
            "image_url": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
            "tech_stack": ["React", "Node.js", "MongoDB", "REST API", "Real-time Analytics"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/social-media",
            "case_study_content": """## Overview
A powerful social media management tool designed to help businesses and content creators manage their social media presence efficiently. The platform enables users to schedule posts, track engagement metrics, and analyze performance across multiple social platforms.

## Challenge
Managing multiple social media accounts can be time-consuming and challenging. Users needed a unified platform to create, schedule, and publish content across different social networks while tracking engagement and performance metrics in real-time.

## Solution
We developed a comprehensive social media management platform with the following key features:

• Multi-platform post scheduling for Twitter, Instagram, LinkedIn, and Facebook
• Real-time engagement tracking and analytics
• Content calendar with visual scheduling interface
• Performance metrics and reporting dashboard
• Media library for managing images and assets
• Team collaboration tools

The platform provides an intuitive interface where users can compose posts, select target platforms, schedule publication times, and monitor engagement metrics all from a single dashboard.

## Results
• Reduced social media management time by 60%
• Increased engagement rates by 45% through optimized scheduling
• Improved team collaboration with centralized content management
• Real-time analytics providing actionable insights

## Testimonial
"This tool has transformed how we manage our social media presence. The scheduling features and analytics have helped us increase engagement significantly."

— Sarah Johnson, Marketing Director""",
            "status": "completed",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Real-Time Analytics Dashboard",
            "slug": "real-time-analytics-dashboard",
            "category": "Data Analytics",
            "description": "An advanced real-time analytics dashboard for monitoring business metrics, user behavior, and performance indicators with live data updates, interactive charts, and comprehensive reporting capabilities.",
            "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
            "tech_stack": ["React", "WebSocket", "D3.js", "Python", "PostgreSQL", "Redis"],
            "featured": True,
            "is_private": False,
            "live_demo_url": "/demo/analytics",
            "case_study_content": """## Overview
A sophisticated real-time analytics dashboard that provides businesses with instant insights into their key performance metrics. The platform features live data updates, interactive visualizations, and comprehensive reporting tools.

## Challenge
Organizations needed a way to monitor their business metrics in real-time to make data-driven decisions quickly. Traditional analytics tools had delays and lacked the real-time capabilities required for modern fast-paced business environments.

## Solution
We built a powerful real-time analytics dashboard with the following capabilities:

• Live data streaming with WebSocket connections
• Real-time metric updates for revenue, users, and engagement
• Interactive data visualizations and charts
• Traffic source analysis and breakdown
• Device and geographic user analytics
• Top-performing pages tracking
• Custom date range filtering and comparisons
• Automated report generation and export

The dashboard updates metrics every few seconds, providing an up-to-the-minute view of business performance with beautiful, interactive visualizations.

## Results
• Real-time data processing with sub-second latency
• Improved decision-making speed by 70%
• Reduced data analysis time from hours to minutes
• Increased data visibility across all departments

## Testimonial
"The real-time capabilities of this dashboard have been game-changing for our business. We can now respond to trends and issues immediately."

— Michael Chen, Chief Data Officer""",
            "status": "completed",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
    ]
    
    # Check if projects already exist
    for project in demo_projects:
        existing = await projects_collection.find_one({"slug": project["slug"]})
        if existing:
            # Update existing project
            await projects_collection.update_one(
                {"slug": project["slug"]},
                {"$set": project}
            )
            print(f"✅ Updated project: {project['title']}")
        else:
            # Insert new project
            await projects_collection.insert_one(project)
            print(f"✅ Added new project: {project['title']}")
    
    print("\n🎉 Demo projects seeding completed!")

if __name__ == "__main__":
    asyncio.run(seed_demo_projects())
