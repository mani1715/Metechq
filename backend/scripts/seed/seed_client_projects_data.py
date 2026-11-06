"""
Seed script to populate sample client projects data with all features
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
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'mspn_dev_db')

async def seed_client_projects():
    """Create sample client projects with complete features"""
    from auth.password import hash_password
    
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    
    print("🚀 Starting to seed client projects data...")
    
    # Check if we have admin
    admin = await db.admins.find_one({'role': 'super_admin'})
    
    if not admin:
        print("⚠️  No admin found. Please create an admin first.")
        return
    
    print(f"✅ Found admin: {admin['username']}")
    
    # Create sample clients if they don't exist
    clients = await db.clients.find({'is_active': True}).to_list(length=10)
    
    if not clients:
        print("📝 Creating sample clients...")
        sample_clients = [
            {
                'id': str(uuid.uuid4()),
                'name': 'John Smith',
                'email': 'john.smith@example.com',
                'company': 'TechStart Inc.',
                'phone': '+1-555-0101',
                'password_hash': hash_password('client123'),
                'is_active': True,
                'created_at': datetime.now().isoformat(),
                'created_by': admin['id']
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'Sarah Johnson',
                'email': 'sarah.johnson@example.com',
                'company': 'FitLife Apps',
                'phone': '+1-555-0102',
                'password_hash': hash_password('client123'),
                'is_active': True,
                'created_at': datetime.now().isoformat(),
                'created_by': admin['id']
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'Michael Chen',
                'email': 'michael.chen@example.com',
                'company': 'DataViz Solutions',
                'phone': '+1-555-0103',
                'password_hash': hash_password('client123'),
                'is_active': True,
                'created_at': datetime.now().isoformat(),
                'created_by': admin['id']
            }
        ]
        
        for sample_client in sample_clients:
            await db.clients.insert_one(sample_client)
            print(f"✅ Created client: {sample_client['name']} ({sample_client['email']})")
        
        clients = sample_clients
    else:
        print(f"✅ Found {len(clients)} existing clients")
    
    # Sample projects data
    projects_data = [
        {
            'name': 'E-commerce Website Development',
            'description': 'Building a modern e-commerce platform with payment integration and inventory management',
            'status': 'in_progress',
            'priority': 'high',
            'progress': 65,
            'expected_delivery': (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
            'notes': 'Project is progressing well. Payment gateway integration completed. Working on the checkout flow.',
            'milestones': [
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Design & Wireframing',
                    'description': 'Complete UI/UX design and wireframes',
                    'status': 'completed',
                    'due_date': (datetime.now() - timedelta(days=15)).strftime('%Y-%m-%d'),
                    'order': 1
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Frontend Development',
                    'description': 'Build responsive frontend with React',
                    'status': 'in_progress',
                    'due_date': (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d'),
                    'order': 2
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Payment Integration',
                    'description': 'Integrate Stripe payment gateway',
                    'status': 'completed',
                    'due_date': (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d'),
                    'order': 3
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Testing & Deployment',
                    'description': 'Complete testing and deploy to production',
                    'status': 'pending',
                    'due_date': (datetime.now() + timedelta(days=25)).strftime('%Y-%m-%d'),
                    'order': 4
                }
            ],
            'tasks': [
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Product catalog page',
                    'description': 'Create product listing with filters and search',
                    'status': 'completed',
                    'priority': 'high',
                    'due_date': (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d')
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Shopping cart functionality',
                    'description': 'Implement add to cart and cart management',
                    'status': 'in_progress',
                    'priority': 'high',
                    'due_date': (datetime.now() + timedelta(days=5)).strftime('%Y-%m-%d')
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'User authentication',
                    'description': 'Setup login, register, and password reset',
                    'status': 'completed',
                    'priority': 'medium',
                    'due_date': (datetime.now() - timedelta(days=10)).strftime('%Y-%m-%d')
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Order history page',
                    'description': 'Display user order history with tracking',
                    'status': 'todo',
                    'priority': 'medium',
                    'due_date': (datetime.now() + timedelta(days=15)).strftime('%Y-%m-%d')
                }
            ],
            'team_members': [
                {
                    'admin_id': admin['id'],
                    'admin_name': admin['username'],
                    'role': 'Project Manager & Lead Developer',
                    'added_at': datetime.now().isoformat()
                }
            ],
            'budget': {
                'total_amount': 15000,
                'currency': 'USD',
                'paid_amount': 7500,
                'pending_amount': 7500,
                'payment_terms': '50% upfront, 50% on completion. Payment due within 30 days of invoice.'
            },
            'files': [
                {
                    'id': str(uuid.uuid4()),
                    'filename': 'project-requirements.pdf',
                    'uploaded_at': datetime.now().isoformat()
                },
                {
                    'id': str(uuid.uuid4()),
                    'filename': 'design-mockups.fig',
                    'uploaded_at': datetime.now().isoformat()
                },
                {
                    'id': str(uuid.uuid4()),
                    'filename': 'api-documentation.pdf',
                    'uploaded_at': datetime.now().isoformat()
                }
            ],
            'activity_log': [
                {
                    'id': str(uuid.uuid4()),
                    'action': 'project_created',
                    'description': 'Project created and assigned to client',
                    'user_name': admin['username'],
                    'timestamp': (datetime.now() - timedelta(days=30)).isoformat()
                },
                {
                    'id': str(uuid.uuid4()),
                    'action': 'milestone_completed',
                    'description': 'Completed milestone: Design & Wireframing',
                    'user_name': admin['username'],
                    'timestamp': (datetime.now() - timedelta(days=15)).isoformat()
                },
                {
                    'id': str(uuid.uuid4()),
                    'action': 'file_uploaded',
                    'description': 'Uploaded file: api-documentation.pdf',
                    'user_name': admin['username'],
                    'timestamp': (datetime.now() - timedelta(days=2)).isoformat()
                },
                {
                    'id': str(uuid.uuid4()),
                    'action': 'progress_updated',
                    'description': 'Project progress updated to 65%',
                    'user_name': admin['username'],
                    'timestamp': datetime.now().isoformat()
                }
            ]
        },
        {
            'name': 'Mobile App Development',
            'description': 'Native iOS and Android app for fitness tracking',
            'status': 'pending',
            'priority': 'medium',
            'progress': 20,
            'expected_delivery': (datetime.now() + timedelta(days=60)).strftime('%Y-%m-%d'),
            'notes': 'Project kickoff scheduled for next week. Design phase will start soon.',
            'milestones': [
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Requirements Gathering',
                    'description': 'Finalize app features and requirements',
                    'status': 'completed',
                    'due_date': (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d'),
                    'order': 1
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'App Design',
                    'description': 'Create UI/UX design for both platforms',
                    'status': 'in_progress',
                    'due_date': (datetime.now() + timedelta(days=15)).strftime('%Y-%m-%d'),
                    'order': 2
                }
            ],
            'tasks': [
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Create user personas',
                    'description': 'Define target audience and user profiles',
                    'status': 'completed',
                    'priority': 'high',
                    'due_date': (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d')
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Wireframe creation',
                    'description': 'Design wireframes for key app screens',
                    'status': 'in_progress',
                    'priority': 'high',
                    'due_date': (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
                }
            ],
            'team_members': [
                {
                    'admin_id': admin['id'],
                    'admin_name': admin['username'],
                    'role': 'Mobile App Developer',
                    'added_at': datetime.now().isoformat()
                }
            ],
            'budget': {
                'total_amount': 25000,
                'currency': 'USD',
                'paid_amount': 5000,
                'pending_amount': 20000,
                'payment_terms': '20% upfront, 30% at milestone completion, 50% on final delivery.'
            },
            'files': [
                {
                    'id': str(uuid.uuid4()),
                    'filename': 'app-requirements.docx',
                    'uploaded_at': datetime.now().isoformat()
                }
            ],
            'activity_log': [
                {
                    'id': str(uuid.uuid4()),
                    'action': 'project_created',
                    'description': 'Mobile app project initiated',
                    'user_name': admin['username'],
                    'timestamp': (datetime.now() - timedelta(days=10)).isoformat()
                }
            ]
        },
        {
            'name': 'Dashboard Analytics Platform',
            'description': 'Real-time analytics dashboard with data visualization',
            'status': 'completed',
            'priority': 'high',
            'progress': 100,
            'expected_delivery': (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d'),
            'notes': 'Project completed successfully! All features delivered and tested.',
            'milestones': [
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Data Integration',
                    'description': 'Connect to data sources and APIs',
                    'status': 'completed',
                    'due_date': (datetime.now() - timedelta(days=20)).strftime('%Y-%m-%d'),
                    'order': 1
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Dashboard Development',
                    'description': 'Build interactive dashboard components',
                    'status': 'completed',
                    'due_date': (datetime.now() - timedelta(days=10)).strftime('%Y-%m-%d'),
                    'order': 2
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Deployment',
                    'description': 'Deploy to production environment',
                    'status': 'completed',
                    'due_date': (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d'),
                    'order': 3
                }
            ],
            'tasks': [
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Setup database',
                    'description': 'Configure PostgreSQL database',
                    'status': 'completed',
                    'priority': 'high',
                    'due_date': (datetime.now() - timedelta(days=25)).strftime('%Y-%m-%d')
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Create data models',
                    'description': 'Design and implement data models',
                    'status': 'completed',
                    'priority': 'high',
                    'due_date': (datetime.now() - timedelta(days=22)).strftime('%Y-%m-%d')
                },
                {
                    'id': str(uuid.uuid4()),
                    'title': 'Build charts',
                    'description': 'Implement interactive charts and graphs',
                    'status': 'completed',
                    'priority': 'medium',
                    'due_date': (datetime.now() - timedelta(days=12)).strftime('%Y-%m-%d')
                }
            ],
            'team_members': [
                {
                    'admin_id': admin['id'],
                    'admin_name': admin['username'],
                    'role': 'Full Stack Developer',
                    'added_at': datetime.now().isoformat()
                }
            ],
            'budget': {
                'total_amount': 12000,
                'currency': 'USD',
                'paid_amount': 12000,
                'pending_amount': 0,
                'payment_terms': 'Paid in full on completion.'
            },
            'files': [
                {
                    'id': str(uuid.uuid4()),
                    'filename': 'final-deliverables.zip',
                    'uploaded_at': datetime.now().isoformat()
                },
                {
                    'id': str(uuid.uuid4()),
                    'filename': 'user-manual.pdf',
                    'uploaded_at': datetime.now().isoformat()
                }
            ],
            'activity_log': [
                {
                    'id': str(uuid.uuid4()),
                    'action': 'project_created',
                    'description': 'Dashboard project started',
                    'user_name': admin['username'],
                    'timestamp': (datetime.now() - timedelta(days=45)).isoformat()
                },
                {
                    'id': str(uuid.uuid4()),
                    'action': 'project_completed',
                    'description': 'Project completed and delivered',
                    'user_name': admin['username'],
                    'timestamp': (datetime.now() - timedelta(days=5)).isoformat()
                }
            ]
        }
    ]
    
    # Create projects for each client
    created_count = 0
    for i, client_doc in enumerate(clients):
        # Assign 1-2 projects per client
        projects_for_client = projects_data[i:i+2] if i < len(projects_data) else [projects_data[0]]
        
        for project_data in projects_for_client:
            # Check if project already exists
            existing = await db.client_projects.find_one({
                'name': project_data['name'],
                'client_id': client_doc['id']
            })
            
            if existing:
                print(f"⏭️  Project '{project_data['name']}' already exists for client {client_doc['name']}")
                continue
            
            # Create project
            project = {
                'id': str(uuid.uuid4()),
                'client_id': client_doc['id'],
                **project_data,
                'start_date': (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d'),
                'tags': [],
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
                'created_by': admin['id']
            }
            
            await db.client_projects.insert_one(project)
            created_count += 1
            print(f"✅ Created project: {project['name']} for client: {client_doc['name']}")
    
    print(f"\n🎉 Successfully created {created_count} sample projects!")
    print("\n📋 Summary:")
    print(f"   - Projects with milestones: {len([p for p in projects_data if p.get('milestones')])}") 
    print(f"   - Projects with tasks: {len([p for p in projects_data if p.get('tasks')])}")
    print(f"   - Projects with budget: {len([p for p in projects_data if p.get('budget')])}")
    print(f"   - Projects with files: {len([p for p in projects_data if p.get('files')])}")
    print(f"   - Projects with team members: {len([p for p in projects_data if p.get('team_members')])}")
    print("\n✨ All 8 tabs features are populated:")
    print("   1. ✓ Overview (status, progress, description, notes)")
    print("   2. ✓ Milestones (with due dates and status)")
    print("   3. ✓ Tasks (with assignments and priorities)")
    print("   4. ✓ Team (team members with roles)")
    print("   5. ✓ Budget (total, paid, pending amounts)")
    print("   6. ✓ Files (project documents)")
    print("   7. ✓ Activity (activity logs)")
    print("   8. ✓ Chat (ready to use)")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_client_projects())
