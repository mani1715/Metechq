"""
Create a demo client with a comprehensive project to demonstrate all features
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
import os
from datetime import datetime, date, timedelta
from pathlib import Path

# Add backend directory to path

from database import clients_collection, client_projects_collection
from models.client_project import (
    ClientProject, ProjectMilestone, ProjectTask, ProjectFile,
    ProjectComment, ChatMessage, ProjectActivity, TeamMember, Budget
)
from auth.password import hash_password
import uuid

async def create_demo_data():
    """Create a demo client and project with all features"""
    
    # Check if demo client already exists
    existing_client = await clients_collection.find_one({"email": "maneesh@example.com"})
    
    if not existing_client:
        # Create demo client
        demo_client = {
            "id": str(uuid.uuid4()),
            "name": "Maneesh Kumar",
            "email": "maneesh@example.com",
            "password_hash": hash_password("demo123"),  # Password: demo123
            "company": "mspn",
            "phone": "+1-234-567-8900",
            "created_at": datetime.utcnow().isoformat(),
            "created_by": "system"
        }
        
        await clients_collection.insert_one(demo_client)
        print(f"✅ Created demo client: {demo_client['name']}")
        print(f"   Email: {demo_client['email']}")
        print(f"   Password: demo123")
        
        client_id = demo_client['id']
    else:
        client_id = existing_client['id']
        print(f"✅ Demo client already exists: {existing_client['name']}")
    
    # Check if demo project already exists
    existing_project = await client_projects_collection.find_one({
        "client_id": client_id,
        "name": "E-Commerce Website Development"
    })
    
    if existing_project:
        print("✅ Demo project already exists")
        return
    
    # Create comprehensive demo project
    today = date.today()
    project_id = str(uuid.uuid4())
    
    # Create milestones
    milestones = [
        ProjectMilestone(
            title="Project Planning & Requirements",
            description="Define project scope, gather requirements, and create technical specifications",
            due_date=today + timedelta(days=7),
            status="completed",
            completion_date=datetime.utcnow().isoformat(),
            order=1
        ),
        ProjectMilestone(
            title="UI/UX Design",
            description="Create wireframes, mockups, and design system for the e-commerce platform",
            due_date=today + timedelta(days=14),
            status="completed",
            completion_date=datetime.utcnow().isoformat(),
            order=2
        ),
        ProjectMilestone(
            title="Backend Development",
            description="Develop API endpoints, database schemas, and server-side logic",
            due_date=today + timedelta(days=30),
            status="in_progress",
            order=3
        ),
        ProjectMilestone(
            title="Frontend Development",
            description="Build responsive UI components and integrate with backend APIs",
            due_date=today + timedelta(days=45),
            status="in_progress",
            order=4
        ),
        ProjectMilestone(
            title="Testing & QA",
            description="Conduct comprehensive testing, bug fixes, and quality assurance",
            due_date=today + timedelta(days=55),
            status="pending",
            order=5
        ),
        ProjectMilestone(
            title="Deployment & Launch",
            description="Deploy to production, final checks, and go live",
            due_date=today + timedelta(days=60),
            status="pending",
            order=6
        )
    ]
    
    # Create tasks
    tasks = [
        ProjectTask(
            title="Set up project repository",
            description="Initialize Git repository and set up project structure",
            status="completed",
            priority="high",
            assigned_to="admin",
            due_date=today + timedelta(days=2),
            completed_at=datetime.utcnow().isoformat(),
            milestone_id=milestones[0].id
        ),
        ProjectTask(
            title="Design product catalog page",
            description="Create mockups for product listing and filtering",
            status="completed",
            priority="high",
            assigned_to="admin",
            due_date=today + timedelta(days=10),
            completed_at=datetime.utcnow().isoformat(),
            milestone_id=milestones[1].id
        ),
        ProjectTask(
            title="Implement user authentication API",
            description="Build JWT-based authentication system",
            status="in_progress",
            priority="high",
            assigned_to="admin",
            due_date=today + timedelta(days=20),
            milestone_id=milestones[2].id
        ),
        ProjectTask(
            title="Build shopping cart functionality",
            description="Implement add to cart, update quantity, and checkout features",
            status="in_progress",
            priority="high",
            assigned_to="admin",
            due_date=today + timedelta(days=35),
            milestone_id=milestones[3].id
        ),
        ProjectTask(
            title="Integrate payment gateway",
            description="Set up Stripe payment processing",
            status="pending",
            priority="urgent",
            assigned_to="admin",
            due_date=today + timedelta(days=40),
            milestone_id=milestones[3].id
        ),
        ProjectTask(
            title="Write unit tests",
            description="Create comprehensive test coverage for all modules",
            status="pending",
            priority="medium",
            assigned_to="admin",
            due_date=today + timedelta(days=50),
            milestone_id=milestones[4].id
        )
    ]
    
    # Create team members
    team_members = [
        TeamMember(
            admin_id="admin-001",
            admin_name="John Doe",
            role="Project Manager"
        ),
        TeamMember(
            admin_id="admin-002",
            admin_name="Sarah Smith",
            role="Lead Developer"
        ),
        TeamMember(
            admin_id="admin-003",
            admin_name="Mike Johnson",
            role="UI/UX Designer"
        )
    ]
    
    # Create budget
    budget = Budget(
        total_amount=25000.00,
        currency="USD",
        paid_amount=10000.00,
        pending_amount=15000.00,
        payment_terms="50% upfront, 30% on milestone completion, 20% on final delivery"
    )
    
    # Create activity log
    activity_log = [
        ProjectActivity(
            action="created",
            description="Project 'E-Commerce Website Development' created",
            user_id="admin",
            user_name="Admin"
        ),
        ProjectActivity(
            action="milestone_completed",
            description="Milestone 'Project Planning & Requirements' completed",
            user_id="admin",
            user_name="Admin"
        ),
        ProjectActivity(
            action="milestone_completed",
            description="Milestone 'UI/UX Design' completed",
            user_id="admin",
            user_name="Admin"
        ),
        ProjectActivity(
            action="task_completed",
            description="Task 'Set up project repository' marked as completed",
            user_id="admin",
            user_name="Admin"
        ),
        ProjectActivity(
            action="budget_updated",
            description="Project budget updated",
            user_id="admin",
            user_name="Admin"
        )
    ]
    
    # Create chat messages
    chat_messages = [
        ChatMessage(
            sender_id="admin",
            sender_name="Admin",
            sender_type="admin",
            message="Hi Maneesh! Welcome to your project dashboard. I've set up the initial project structure and milestones. Feel free to review and let me know if you have any questions!",
            read=True
        ),
        ChatMessage(
            sender_id=client_id,
            sender_name="Maneesh Kumar",
            sender_type="client",
            message="Thank you! The milestones look great. Can you provide more details about the payment schedule?",
            read=True
        ),
        ChatMessage(
            sender_id="admin",
            sender_name="Admin",
            sender_type="admin",
            message="Sure! The payment is split as follows: 50% ($12,500) upfront which you've already paid, 30% ($7,500) when we complete the backend and frontend development, and the final 20% ($5,000) upon successful deployment and launch.",
            read=True
        )
    ]
    
    # Create comments
    comments = [
        ProjectComment(
            user_id="admin",
            user_name="Admin",
            user_type="admin",
            message="Great progress so far! We've completed the design phase ahead of schedule. Moving forward with development."
        ),
        ProjectComment(
            user_id=client_id,
            user_name="Maneesh Kumar",
            user_type="client",
            message="Excellent work on the designs! I'm really impressed with the UI mockups. Looking forward to seeing the development progress."
        )
    ]
    
    # Create the project
    demo_project = ClientProject(
        id=project_id,
        name="E-Commerce Website Development",
        client_id=client_id,
        description="Full-stack e-commerce platform with product catalog, shopping cart, payment integration, and admin dashboard. Built with React frontend and FastAPI backend.",
        status="in_progress",
        priority="high",
        progress=45,
        start_date=today,
        expected_delivery=today + timedelta(days=60),
        notes="Project is progressing well. We've completed the planning and design phases. Currently working on backend API development and frontend components. Payment gateway integration is scheduled for next sprint.",
        milestones=milestones,
        tasks=tasks,
        files=[],
        comments=comments,
        chat_messages=chat_messages,
        activity_log=activity_log,
        team_members=team_members,
        budget=budget,
        tags=["e-commerce", "react", "fastapi", "stripe"],
        created_by="admin",
        last_activity_at=datetime.utcnow()
    )
    
    # Convert to dict for MongoDB
    project_dict = demo_project.model_dump()
    project_dict['created_at'] = project_dict['created_at'].isoformat()
    project_dict['last_activity_at'] = project_dict['last_activity_at'].isoformat()
    project_dict['start_date'] = project_dict['start_date'].isoformat()
    project_dict['expected_delivery'] = project_dict['expected_delivery'].isoformat()
    
    # Convert nested objects
    project_dict['milestones'] = [
        {**m, 'created_at': m['created_at'].isoformat(), 'due_date': m['due_date'].isoformat() if m['due_date'] else None}
        for m in project_dict['milestones']
    ]
    project_dict['tasks'] = [
        {**t, 'created_at': t['created_at'].isoformat(), 'due_date': t['due_date'].isoformat() if t['due_date'] else None}
        for t in project_dict['tasks']
    ]
    project_dict['comments'] = [
        {**c, 'created_at': c['created_at'].isoformat()}
        for c in project_dict['comments']
    ]
    project_dict['chat_messages'] = [
        {**cm, 'created_at': cm['created_at'].isoformat()}
        for cm in project_dict['chat_messages']
    ]
    project_dict['activity_log'] = [
        {**a, 'timestamp': a['timestamp'].isoformat()}
        for a in project_dict['activity_log']
    ]
    project_dict['team_members'] = [
        {**tm, 'added_at': tm['added_at'].isoformat()}
        for tm in project_dict['team_members']
    ]
    
    await client_projects_collection.insert_one(project_dict)
    
    print(f"\n✅ Created comprehensive demo project: {demo_project.name}")
    print(f"   Status: {demo_project.status}")
    print(f"   Progress: {demo_project.progress}%")
    print(f"   Milestones: {len(milestones)}")
    print(f"   Tasks: {len(tasks)}")
    print(f"   Team Members: {len(team_members)}")
    print(f"   Budget: ${budget.total_amount:,.2f}")
    print(f"   Chat Messages: {len(chat_messages)}")
    
    print("\n" + "="*60)
    print("DEMO CREDENTIALS:")
    print("="*60)
    print("Client Login:")
    print("  URL: http://localhost:3000/client/login")
    print("  Email: maneesh@example.com")
    print("  Password: demo123")
    print("\nAdmin Login:")
    print("  URL: http://localhost:3000/admin/login")
    print("  Username: admin")
    print("  Password: admin123")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(create_demo_data())
