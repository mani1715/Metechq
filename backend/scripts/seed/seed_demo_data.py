"""
Seed script to create demo clients and projects for testing
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
import sys
from datetime import datetime, timedelta
import uuid
from database import clients_collection, client_projects_collection, admins_collection
from auth.password import hash_password

async def seed_demo_data():
    """Create demo clients and projects"""
    print("🌱 Starting data seeding...")
    
    # Check if admin exists
    admin = await admins_collection.find_one({"role": "super_admin"})
    if not admin:
        print("❌ No admin found! Please run the server first to create default admin.")
        return
    
    print(f"✅ Found admin: {admin['username']}")
    
    # Check if data already exists
    existing_clients = await clients_collection.count_documents({})
    if existing_clients > 0:
        print(f"ℹ️  Found {existing_clients} existing clients")
        response = input("Do you want to add more demo data? (y/n): ")
        if response.lower() != 'y':
            print("Skipping data creation...")
            return
    
    # Create demo clients
    demo_clients = [
        {
            "id": str(uuid.uuid4()),
            "name": "Acme Corporation",
            "email": "john@acmecorp.com",
            "company": "Acme Corporation",
            "phone": "+1-555-0101",
            "password_hash": hash_password("client123"),
            "projects_count": 0,
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Tech Innovators",
            "email": "sarah@techinnovators.com",
            "company": "Tech Innovators",
            "phone": "+1-555-0202",
            "password_hash": hash_password("client123"),
            "projects_count": 0,
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Digital Solutions Ltd",
            "email": "mike@digitalsolutions.com",
            "company": "Digital Solutions Ltd",
            "phone": "+1-555-0303",
            "password_hash": hash_password("client123"),
            "projects_count": 0,
            "created_at": datetime.utcnow().isoformat()
        }
    ]
    
    print(f"\n📝 Creating {len(demo_clients)} demo clients...")
    for client in demo_clients:
        await clients_collection.insert_one(client)
        print(f"  ✅ Created client: {client['name']} ({client['email']})")
    
    # Create demo projects
    print(f"\n📝 Creating demo projects...")
    
    now = datetime.utcnow()
    
    demo_projects = [
        {
            "id": str(uuid.uuid4()),
            "name": "E-commerce Website Redesign",
            "client_id": demo_clients[0]['id'],
            "description": "Complete redesign of the e-commerce platform with modern UI/UX and improved performance.",
            "status": "in_progress",
            "priority": "high",
            "progress": 65,
            "start_date": (now - timedelta(days=30)).isoformat(),
            "expected_delivery": (now + timedelta(days=45)).isoformat(),
            "actual_delivery": None,
            "notes": "Client is very responsive and provides quick feedback.",
            "milestones": [
                {
                    "id": str(uuid.uuid4()),
                    "title": "Design Phase",
                    "description": "Create mockups and prototypes",
                    "due_date": (now - timedelta(days=15)).isoformat(),
                    "status": "completed",
                    "completion_date": (now - timedelta(days=16)).isoformat(),
                    "order": 0,
                    "created_at": (now - timedelta(days=30)).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Frontend Development",
                    "description": "Implement responsive frontend",
                    "due_date": now.isoformat(),
                    "status": "in_progress",
                    "completion_date": None,
                    "order": 1,
                    "created_at": (now - timedelta(days=15)).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Backend Integration",
                    "description": "API integration and database setup",
                    "due_date": (now + timedelta(days=20)).isoformat(),
                    "status": "pending",
                    "completion_date": None,
                    "order": 2,
                    "created_at": (now - timedelta(days=15)).isoformat()
                }
            ],
            "tasks": [
                {
                    "id": str(uuid.uuid4()),
                    "title": "Create homepage design",
                    "description": "Design modern homepage with hero section",
                    "status": "completed",
                    "priority": "high",
                    "assigned_to": admin['id'],
                    "due_date": (now - timedelta(days=20)).isoformat(),
                    "completed_at": (now - timedelta(days=21)).isoformat(),
                    "milestone_id": None,
                    "created_at": (now - timedelta(days=30)).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Implement product listing page",
                    "description": "Build responsive product grid with filters",
                    "status": "in_progress",
                    "priority": "high",
                    "assigned_to": admin['id'],
                    "due_date": (now + timedelta(days=5)).isoformat(),
                    "completed_at": None,
                    "milestone_id": None,
                    "created_at": (now - timedelta(days=10)).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Shopping cart functionality",
                    "description": "Build cart with add/remove items",
                    "status": "pending",
                    "priority": "medium",
                    "assigned_to": None,
                    "due_date": (now + timedelta(days=15)).isoformat(),
                    "completed_at": None,
                    "milestone_id": None,
                    "created_at": (now - timedelta(days=5)).isoformat()
                }
            ],
            "files": [],
            "comments": [
                {
                    "id": str(uuid.uuid4()),
                    "user_id": admin['id'],
                    "user_name": admin['username'],
                    "user_type": "admin",
                    "message": "Project is progressing well. Frontend development is 70% complete.",
                    "created_at": (now - timedelta(days=2)).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "user_id": demo_clients[0]['id'],
                    "user_name": demo_clients[0]['name'],
                    "user_type": "client",
                    "message": "Looking great! Can we add a product comparison feature?",
                    "created_at": (now - timedelta(days=1)).isoformat()
                }
            ],
            "chat_messages": [
                {
                    "id": str(uuid.uuid4()),
                    "sender_id": admin['id'],
                    "sender_name": admin['username'],
                    "sender_type": "admin",
                    "message": "Hi! The design mockups are ready for your review.",
                    "read": True,
                    "created_at": (now - timedelta(days=10)).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "sender_id": demo_clients[0]['id'],
                    "sender_name": demo_clients[0]['name'],
                    "sender_type": "client",
                    "message": "Looks amazing! I approve the design.",
                    "read": True,
                    "created_at": (now - timedelta(days=9)).isoformat()
                }
            ],
            "activity_log": [
                {
                    "id": str(uuid.uuid4()),
                    "action": "created",
                    "description": "Project 'E-commerce Website Redesign' created",
                    "user_id": admin['id'],
                    "user_name": admin['username'],
                    "timestamp": (now - timedelta(days=30)).isoformat(),
                    "metadata": {}
                },
                {
                    "id": str(uuid.uuid4()),
                    "action": "milestone_completed",
                    "description": "Milestone 'Design Phase' completed",
                    "user_id": admin['id'],
                    "user_name": admin['username'],
                    "timestamp": (now - timedelta(days=16)).isoformat(),
                    "metadata": {}
                }
            ],
            "team_members": [
                {
                    "admin_id": admin['id'],
                    "admin_name": admin['username'],
                    "role": "Lead Developer",
                    "added_at": (now - timedelta(days=30)).isoformat()
                }
            ],
            "budget": {
                "total_amount": 15000.0,
                "currency": "USD",
                "paid_amount": 7500.0,
                "pending_amount": 7500.0,
                "payment_terms": "50% upfront, 50% on completion"
            },
            "tags": ["ecommerce", "web", "redesign"],
            "created_at": (now - timedelta(days=30)).isoformat(),
            "updated_at": (now - timedelta(days=2)).isoformat(),
            "last_activity_at": (now - timedelta(days=1)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Mobile App Development",
            "client_id": demo_clients[1]['id'],
            "description": "Native mobile app for iOS and Android with social features.",
            "status": "in_progress",
            "priority": "urgent",
            "progress": 40,
            "start_date": (now - timedelta(days=20)).isoformat(),
            "expected_delivery": (now + timedelta(days=60)).isoformat(),
            "actual_delivery": None,
            "notes": "Using React Native for cross-platform development.",
            "milestones": [
                {
                    "id": str(uuid.uuid4()),
                    "title": "UI/UX Design",
                    "description": "Design app screens and user flows",
                    "due_date": (now - timedelta(days=5)).isoformat(),
                    "status": "completed",
                    "completion_date": (now - timedelta(days=6)).isoformat(),
                    "order": 0,
                    "created_at": (now - timedelta(days=20)).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Core Features Development",
                    "description": "Build authentication, profile, feed",
                    "due_date": (now + timedelta(days=15)).isoformat(),
                    "status": "in_progress",
                    "completion_date": None,
                    "order": 1,
                    "created_at": (now - timedelta(days=15)).isoformat()
                }
            ],
            "tasks": [
                {
                    "id": str(uuid.uuid4()),
                    "title": "Setup React Native project",
                    "description": "Initialize project with navigation",
                    "status": "completed",
                    "priority": "high",
                    "assigned_to": admin['id'],
                    "due_date": (now - timedelta(days=15)).isoformat(),
                    "completed_at": (now - timedelta(days=16)).isoformat(),
                    "milestone_id": None,
                    "created_at": (now - timedelta(days=20)).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Build authentication screens",
                    "description": "Login, signup, forgot password",
                    "status": "in_progress",
                    "priority": "high",
                    "assigned_to": admin['id'],
                    "due_date": (now + timedelta(days=3)).isoformat(),
                    "completed_at": None,
                    "milestone_id": None,
                    "created_at": (now - timedelta(days=8)).isoformat()
                }
            ],
            "files": [],
            "comments": [],
            "chat_messages": [],
            "activity_log": [
                {
                    "id": str(uuid.uuid4()),
                    "action": "created",
                    "description": "Project 'Mobile App Development' created",
                    "user_id": admin['id'],
                    "user_name": admin['username'],
                    "timestamp": (now - timedelta(days=20)).isoformat(),
                    "metadata": {}
                }
            ],
            "team_members": [
                {
                    "admin_id": admin['id'],
                    "admin_name": admin['username'],
                    "role": "Full Stack Developer",
                    "added_at": (now - timedelta(days=20)).isoformat()
                }
            ],
            "budget": {
                "total_amount": 25000.0,
                "currency": "USD",
                "paid_amount": 10000.0,
                "pending_amount": 15000.0,
                "payment_terms": "40% upfront, 30% milestone, 30% completion"
            },
            "tags": ["mobile", "ios", "android", "react-native"],
            "created_at": (now - timedelta(days=20)).isoformat(),
            "updated_at": (now - timedelta(days=1)).isoformat(),
            "last_activity_at": (now - timedelta(days=1)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Brand Identity Design",
            "client_id": demo_clients[2]['id'],
            "description": "Complete brand identity including logo, colors, typography, and guidelines.",
            "status": "review",
            "priority": "medium",
            "progress": 85,
            "start_date": (now - timedelta(days=40)).isoformat(),
            "expected_delivery": (now + timedelta(days=5)).isoformat(),
            "actual_delivery": None,
            "notes": "Client loves the design direction. Final revisions in progress.",
            "milestones": [
                {
                    "id": str(uuid.uuid4()),
                    "title": "Logo Concepts",
                    "description": "Create 3 logo concepts",
                    "due_date": (now - timedelta(days=30)).isoformat(),
                    "status": "completed",
                    "completion_date": (now - timedelta(days=31)).isoformat(),
                    "order": 0,
                    "created_at": (now - timedelta(days=40)).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Brand Guidelines",
                    "description": "Create comprehensive brand guide",
                    "due_date": (now + timedelta(days=5)).isoformat(),
                    "status": "in_progress",
                    "completion_date": None,
                    "order": 1,
                    "created_at": (now - timedelta(days=20)).isoformat()
                }
            ],
            "tasks": [],
            "files": [],
            "comments": [
                {
                    "id": str(uuid.uuid4()),
                    "user_id": demo_clients[2]['id'],
                    "user_name": demo_clients[2]['name'],
                    "user_type": "client",
                    "message": "The logo looks fantastic! Can we see it in different color variations?",
                    "created_at": (now - timedelta(days=3)).isoformat()
                }
            ],
            "chat_messages": [],
            "activity_log": [
                {
                    "id": str(uuid.uuid4()),
                    "action": "created",
                    "description": "Project 'Brand Identity Design' created",
                    "user_id": admin['id'],
                    "user_name": admin['username'],
                    "timestamp": (now - timedelta(days=40)).isoformat(),
                    "metadata": {}
                },
                {
                    "id": str(uuid.uuid4()),
                    "action": "status_changed",
                    "description": "Status changed from 'in_progress' to 'review'",
                    "user_id": admin['id'],
                    "user_name": admin['username'],
                    "timestamp": (now - timedelta(days=5)).isoformat(),
                    "metadata": {}
                }
            ],
            "team_members": [
                {
                    "admin_id": admin['id'],
                    "admin_name": admin['username'],
                    "role": "Brand Designer",
                    "added_at": (now - timedelta(days=40)).isoformat()
                }
            ],
            "budget": {
                "total_amount": 5000.0,
                "currency": "USD",
                "paid_amount": 2500.0,
                "pending_amount": 2500.0,
                "payment_terms": "50% upfront, 50% on delivery"
            },
            "tags": ["branding", "design", "logo"],
            "created_at": (now - timedelta(days=40)).isoformat(),
            "updated_at": (now - timedelta(days=3)).isoformat(),
            "last_activity_at": (now - timedelta(days=3)).isoformat()
        }
    ]
    
    for project in demo_projects:
        await client_projects_collection.insert_one(project)
        print(f"  ✅ Created project: {project['name']}")
        
        # Update client's project count
        await clients_collection.update_one(
            {"id": project['client_id']},
            {"$inc": {"projects_count": 1}}
        )
    
    print(f"\n✅ Successfully created {len(demo_projects)} demo projects!")
    print("\n📋 Summary:")
    print(f"  • Clients: {len(demo_clients)}")
    print(f"  • Projects: {len(demo_projects)}")
    print("\n🔐 Login Credentials:")
    print("\n  Admin Panel:")
    print("    URL: /admin/login")
    print("    Username: admin")
    print("    Password: admin123")
    print("\n  Client Portal:")
    print("    URL: /client/login")
    print("    Email: john@acmecorp.com")
    print("    Password: client123")
    print("\n  Other clients:")
    for client in demo_clients[1:]:
        print(f"    Email: {client['email']}, Password: client123")
    
if __name__ == "__main__":
    asyncio.run(seed_demo_data())
