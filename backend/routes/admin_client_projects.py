from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from typing import List
from schemas.client_project import (
    ClientProjectCreate, ClientProjectUpdate, ClientProjectResponse, 
    FileUploadResponse, ProjectFileResponse, MilestoneCreate, MilestoneUpdate,
    MilestoneResponse, TaskCreate, TaskUpdate, TaskResponse, CommentCreate,
    CommentResponse, TeamMemberAdd, TeamMemberResponse, BudgetUpdate,
    BudgetResponse, ActivityResponse, ChatMessageCreate, ChatMessageResponse
)
from database import client_projects_collection, clients_collection, admins_collection
from auth.admin_auth import get_current_admin
from models.client_project import (
    ClientProject, ProjectFile, ProjectMilestone, ProjectTask,
    ProjectComment, ProjectActivity, TeamMember, Budget, ChatMessage
)
from utils.currency_converter import get_all_currencies, convert_currency, format_currency, get_currency_info
from datetime import datetime
import os
import uuid
import shutil

router = APIRouter(prefix="/admin/client-projects", tags=["admin-client-projects"])

from config import UPLOAD_DIR as BASE_UPLOAD_DIR
from utils.file_security import validate_file_security, generate_secure_path, MAX_FILE_SIZE_BYTES

# Directory for storing project files safely cross-platform
UPLOAD_DIR = str(BASE_UPLOAD_DIR / "client_projects")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def log_activity(project_id: str, action: str, description: str, user_id: str, user_name: str, metadata=None):
    """Helper function to log activity"""
    activity = ProjectActivity(
        action=action,
        description=description,
        user_id=user_id,
        user_name=user_name,
        metadata=metadata or {}
    )
    return activity.model_dump()

def convert_project_to_response(project_doc) -> ClientProjectResponse:
    """Helper function to convert project document to response"""
    return ClientProjectResponse(
        id=project_doc['id'],
        name=project_doc['name'],
        client_id=project_doc['client_id'],
        description=project_doc.get('description'),
        status=project_doc['status'],
        priority=project_doc.get('priority', 'medium'),
        progress=project_doc['progress'],
        start_date=str(project_doc['start_date']) if project_doc.get('start_date') else None,
        expected_delivery=str(project_doc['expected_delivery']) if project_doc.get('expected_delivery') else None,
        actual_delivery=str(project_doc['actual_delivery']) if project_doc.get('actual_delivery') else None,
        notes=project_doc.get('notes'),
        milestones=[
            MilestoneResponse(
                id=m['id'],
                title=m['title'],
                description=m.get('description'),
                due_date=str(m['due_date']) if m.get('due_date') else None,
                status=m['status'],
                completion_date=m.get('completion_date'),
                order=m.get('order', 0),
                created_at=m.get('created_at', datetime.utcnow().isoformat()) if isinstance(m.get('created_at'), str) else (m.get('created_at').isoformat() if m.get('created_at') else datetime.utcnow().isoformat())
            ) for m in project_doc.get('milestones', [])
        ],
        tasks=[
            TaskResponse(
                id=t['id'],
                title=t['title'],
                description=t.get('description'),
                status=t['status'],
                priority=t.get('priority', 'medium'),
                assigned_to=t.get('assigned_to'),
                due_date=str(t['due_date']) if t.get('due_date') else None,
                completed_at=t.get('completed_at'),
                milestone_id=t.get('milestone_id'),
                created_at=t.get('created_at', datetime.utcnow().isoformat()) if isinstance(t.get('created_at'), str) else (t.get('created_at').isoformat() if t.get('created_at') else datetime.utcnow().isoformat())
            ) for t in project_doc.get('tasks', [])
        ],
        files=[
            ProjectFileResponse(
                id=f['id'],
                filename=f['filename'],
                file_path=f.get('file_path', ''),
                uploaded_at=f.get('uploaded_at', datetime.utcnow().isoformat()) if isinstance(f.get('uploaded_at'), str) else (f.get('uploaded_at').isoformat() if f.get('uploaded_at') else datetime.utcnow().isoformat()),
                uploaded_by=f.get('uploaded_by', 'system'),
                file_size=f.get('file_size', 0),
                file_type=f.get('file_type')
            ) for f in project_doc.get('files', [])
        ],
        comments=[
            CommentResponse(
                id=c['id'],
                user_id=c['user_id'],
                user_name=c['user_name'],
                user_type=c['user_type'],
                message=c['message'],
                created_at=c['created_at'] if isinstance(c['created_at'], str) else c['created_at'].isoformat()
            ) for c in project_doc.get('comments', [])
        ],
        chat_messages=[
            ChatMessageResponse(
                id=cm['id'],
                sender_id=cm['sender_id'],
                sender_name=cm['sender_name'],
                sender_type=cm['sender_type'],
                message=cm['message'],
                read=cm.get('read', False),
                created_at=cm['created_at'] if isinstance(cm['created_at'], str) else cm['created_at'].isoformat()
            ) for cm in project_doc.get('chat_messages', [])
        ],
        activity_log=[
            ActivityResponse(
                id=a['id'],
                action=a['action'],
                description=a['description'],
                user_id=a['user_id'],
                user_name=a['user_name'],
                timestamp=a['timestamp'] if isinstance(a['timestamp'], str) else a['timestamp'].isoformat(),
                metadata=a.get('metadata')
            ) for a in project_doc.get('activity_log', [])
        ],
        team_members=[
            TeamMemberResponse(
                admin_id=tm['admin_id'],
                admin_name=tm['admin_name'],
                role=tm.get('role'),
                added_at=tm['added_at'] if isinstance(tm['added_at'], str) else tm['added_at'].isoformat()
            ) for tm in project_doc.get('team_members', [])
        ],
        budget=BudgetResponse(
            total_amount=project_doc.get('budget', {}).get('total_amount', 0.0),
            currency=project_doc.get('budget', {}).get('currency', 'USD'),
            paid_amount=project_doc.get('budget', {}).get('paid_amount', 0.0),
            pending_amount=project_doc.get('budget', {}).get('pending_amount', 0.0),
            payment_terms=project_doc.get('budget', {}).get('payment_terms')
        ) if project_doc.get('budget') else None,
        tags=project_doc.get('tags', []),
        created_at=project_doc['created_at'] if isinstance(project_doc['created_at'], str) else project_doc['created_at'].isoformat(),
        updated_at=project_doc.get('updated_at'),
        last_activity_at=project_doc.get('last_activity_at')
    )

@router.get("/", response_model=List[ClientProjectResponse])
async def get_all_projects(admin = Depends(get_current_admin)):
    """Get all client projects (Admin only)"""
    projects = []
    async for project_doc in client_projects_collection.find():
        projects.append(convert_project_to_response(project_doc))
    return projects

@router.get("/{project_id}", response_model=ClientProjectResponse)
async def get_project(project_id: str, admin = Depends(get_current_admin)):
    """Get a specific client project (Admin only)"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return convert_project_to_response(project_doc)

@router.post("/", response_model=ClientProjectResponse)
async def create_project(project_data: ClientProjectCreate, admin = Depends(get_current_admin)):
    """Create a new client project (Admin only)"""
    # Verify client exists
    client = await clients_collection.find_one({"id": project_data.client_id})
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Create project
    project = ClientProject(
        name=project_data.name,
        client_id=project_data.client_id,
        description=project_data.description,
        status=project_data.status,
        priority=project_data.priority,
        progress=project_data.progress,
        start_date=project_data.start_date,
        expected_delivery=project_data.expected_delivery,
        notes=project_data.notes,
        tags=project_data.tags or [],
        created_by=admin["id"]
    )
    
    # Add initial activity log
    activity = log_activity(
        project.id,
        "created",
        f"Project '{project.name}' created",
        admin["id"],
        admin.get("username", "Admin")
    )
    project.activity_log.append(ProjectActivity(**activity))
    project.last_activity_at = datetime.utcnow()
    
    project_dict = project.model_dump()
    project_dict['created_at'] = project_dict['created_at'].isoformat()
    project_dict['last_activity_at'] = project_dict['last_activity_at'].isoformat()
    if project_dict['start_date']:
        project_dict['start_date'] = project_dict['start_date'].isoformat()
    if project_dict['expected_delivery']:
        project_dict['expected_delivery'] = project_dict['expected_delivery'].isoformat()
    
    # Convert nested objects
    project_dict['activity_log'] = [
        {**a, 'timestamp': a['timestamp'].isoformat() if isinstance(a['timestamp'], datetime) else a['timestamp']}
        for a in project_dict['activity_log']
    ]
    
    await client_projects_collection.insert_one(project_dict)
    
    return convert_project_to_response(project_dict)

@router.put("/{project_id}", response_model=ClientProjectResponse)
async def update_project(project_id: str, project_data: ClientProjectUpdate, admin = Depends(get_current_admin)):
    """Update a client project (Admin only)"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Prepare update data
    update_data = {}
    changes = []
    
    if project_data.name is not None:
        update_data['name'] = project_data.name
        changes.append(f"Name changed to '{project_data.name}'")
    
    if project_data.client_id is not None:
        client = await clients_collection.find_one({"id": project_data.client_id})
        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Client not found"
            )
        update_data['client_id'] = project_data.client_id
        changes.append("Client changed")
    
    if project_data.description is not None:
        update_data['description'] = project_data.description
        changes.append("Description updated")
    
    if project_data.status is not None:
        old_status = project_doc['status']
        update_data['status'] = project_data.status
        changes.append(f"Status changed from '{old_status}' to '{project_data.status}'")
    
    if project_data.priority is not None:
        update_data['priority'] = project_data.priority
        changes.append(f"Priority changed to '{project_data.priority}'")
    
    if project_data.progress is not None:
        update_data['progress'] = max(0, min(100, project_data.progress))
        changes.append(f"Progress updated to {project_data.progress}%")
    
    if project_data.start_date is not None:
        update_data['start_date'] = project_data.start_date.isoformat()
        changes.append("Start date updated")
    
    if project_data.expected_delivery is not None:
        update_data['expected_delivery'] = project_data.expected_delivery.isoformat()
        changes.append("Expected delivery date updated")
    
    if project_data.actual_delivery is not None:
        update_data['actual_delivery'] = project_data.actual_delivery.isoformat()
        changes.append("Actual delivery date set")
    
    if project_data.notes is not None:
        update_data['notes'] = project_data.notes
        changes.append("Notes updated")
    
    if project_data.tags is not None:
        update_data['tags'] = project_data.tags
        changes.append("Tags updated")
    
    update_data['updated_at'] = datetime.utcnow().isoformat()
    update_data['last_activity_at'] = datetime.utcnow().isoformat()
    
    # Add activity log
    if changes:
        activity = log_activity(
            project_id,
            "updated",
            f"Project updated: {', '.join(changes)}",
            admin["id"],
            admin.get("username", "Admin")
        )
        activity['timestamp'] = activity['timestamp'].isoformat()
        await client_projects_collection.update_one(
            {"id": project_id},
            {"$push": {"activity_log": activity}}
        )
    
    await client_projects_collection.update_one(
        {"id": project_id},
        {"$set": update_data}
    )
    
    updated_project = await client_projects_collection.find_one({"id": project_id})
    return convert_project_to_response(updated_project)

@router.delete("/{project_id}")
async def delete_project(project_id: str, admin = Depends(get_current_admin)):
    """Delete a client project (Admin only)"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    
    if project_doc:
        # Delete associated files from filesystem
        for file_info in project_doc.get('files', []):
            file_path = file_info.get('file_path')
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception:
                    pass
    
    result = await client_projects_collection.delete_one({"id": project_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return {"message": "Project deleted successfully"}

# ============================================================================
# MILESTONE ENDPOINTS
# ============================================================================

@router.post("/{project_id}/milestones", response_model=MilestoneResponse)
async def add_milestone(project_id: str, milestone_data: MilestoneCreate, admin = Depends(get_current_admin)):
    """Add a milestone to project"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    milestone = ProjectMilestone(**milestone_data.model_dump())
    milestone_dict = milestone.model_dump()
    milestone_dict['created_at'] = milestone_dict['created_at'].isoformat()
    if milestone_dict.get('due_date'):
        milestone_dict['due_date'] = milestone_dict['due_date'].isoformat()
    
    # Add activity log
    activity = log_activity(
        project_id,
        "milestone_added",
        f"Milestone '{milestone.title}' added",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$push": {
                "milestones": milestone_dict,
                "activity_log": activity
            },
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    return MilestoneResponse(**{**milestone_dict, 'created_at': milestone_dict['created_at']})

@router.put("/{project_id}/milestones/{milestone_id}", response_model=MilestoneResponse)
async def update_milestone(
    project_id: str,
    milestone_id: str,
    milestone_data: MilestoneUpdate,
    admin = Depends(get_current_admin)
):
    """Update a milestone"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    # Find and update milestone
    milestones = project_doc.get('milestones', [])
    milestone_found = False
    
    for idx, milestone in enumerate(milestones):
        if milestone['id'] == milestone_id:
            milestone_found = True
            if milestone_data.title is not None:
                milestones[idx]['title'] = milestone_data.title
            if milestone_data.description is not None:
                milestones[idx]['description'] = milestone_data.description
            if milestone_data.due_date is not None:
                milestones[idx]['due_date'] = milestone_data.due_date.isoformat()
            if milestone_data.status is not None:
                milestones[idx]['status'] = milestone_data.status
                if milestone_data.status == "completed":
                    milestones[idx]['completion_date'] = datetime.utcnow().isoformat()
            if milestone_data.order is not None:
                milestones[idx]['order'] = milestone_data.order
            break
    
    if not milestone_found:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Milestone not found")
    
    # Add activity log
    activity = log_activity(
        project_id,
        "milestone_updated",
        f"Milestone updated",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$set": {
                "milestones": milestones,
                "last_activity_at": datetime.utcnow().isoformat()
            },
            "$push": {"activity_log": activity}
        }
    )
    
    updated_milestone = milestones[idx]
    return MilestoneResponse(**updated_milestone)

@router.delete("/{project_id}/milestones/{milestone_id}")
async def delete_milestone(project_id: str, milestone_id: str, admin = Depends(get_current_admin)):
    """Delete a milestone"""
    # Add activity log
    activity = log_activity(
        project_id,
        "milestone_deleted",
        f"Milestone deleted",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    result = await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$pull": {"milestones": {"id": milestone_id}},
            "$push": {"activity_log": activity},
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Milestone not found")
    
    return {"message": "Milestone deleted successfully"}

# ============================================================================
# TASK ENDPOINTS
# ============================================================================

@router.post("/{project_id}/tasks", response_model=TaskResponse)
async def add_task(project_id: str, task_data: TaskCreate, admin = Depends(get_current_admin)):
    """Add a task to project"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    task = ProjectTask(**task_data.model_dump())
    task_dict = task.model_dump()
    task_dict['created_at'] = task_dict['created_at'].isoformat()
    if task_dict.get('due_date'):
        task_dict['due_date'] = task_dict['due_date'].isoformat()
    
    # Add activity log
    activity = log_activity(
        project_id,
        "task_added",
        f"Task '{task.title}' added",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$push": {
                "tasks": task_dict,
                "activity_log": activity
            },
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    return TaskResponse(**task_dict)

@router.put("/{project_id}/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    project_id: str,
    task_id: str,
    task_data: TaskUpdate,
    admin = Depends(get_current_admin)
):
    """Update a task"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    tasks = project_doc.get('tasks', [])
    task_found = False
    
    for idx, task in enumerate(tasks):
        if task['id'] == task_id:
            task_found = True
            if task_data.title is not None:
                tasks[idx]['title'] = task_data.title
            if task_data.description is not None:
                tasks[idx]['description'] = task_data.description
            if task_data.status is not None:
                tasks[idx]['status'] = task_data.status
                if task_data.status == "completed":
                    tasks[idx]['completed_at'] = datetime.utcnow().isoformat()
            if task_data.priority is not None:
                tasks[idx]['priority'] = task_data.priority
            if task_data.assigned_to is not None:
                tasks[idx]['assigned_to'] = task_data.assigned_to
            if task_data.due_date is not None:
                tasks[idx]['due_date'] = task_data.due_date.isoformat()
            if task_data.milestone_id is not None:
                tasks[idx]['milestone_id'] = task_data.milestone_id
            break
    
    if not task_found:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    # Add activity log
    activity = log_activity(
        project_id,
        "task_updated",
        f"Task updated",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$set": {
                "tasks": tasks,
                "last_activity_at": datetime.utcnow().isoformat()
            },
            "$push": {"activity_log": activity}
        }
    )
    
    return TaskResponse(**tasks[idx])

@router.delete("/{project_id}/tasks/{task_id}")
async def delete_task(project_id: str, task_id: str, admin = Depends(get_current_admin)):
    """Delete a task"""
    activity = log_activity(
        project_id,
        "task_deleted",
        f"Task deleted",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    result = await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$pull": {"tasks": {"id": task_id}},
            "$push": {"activity_log": activity},
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    return {"message": "Task deleted successfully"}

# ============================================================================
# COMMENT ENDPOINTS
# ============================================================================

@router.post("/{project_id}/comments", response_model=CommentResponse)
async def add_comment(project_id: str, comment_data: CommentCreate, admin = Depends(get_current_admin)):
    """Add a comment to project"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    comment = ProjectComment(
        user_id=admin["id"],
        user_name=admin.get("username", "Admin"),
        user_type="admin",
        message=comment_data.message
    )
    
    comment_dict = comment.model_dump()
    comment_dict['created_at'] = comment_dict['created_at'].isoformat()
    
    # Add activity log
    activity = log_activity(
        project_id,
        "comment_added",
        f"{admin.get('username', 'Admin')} added a comment",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$push": {
                "comments": comment_dict,
                "activity_log": activity
            },
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    return CommentResponse(**comment_dict)

@router.delete("/{project_id}/comments/{comment_id}")
async def delete_comment(project_id: str, comment_id: str, admin = Depends(get_current_admin)):
    """Delete a comment"""
    result = await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$pull": {"comments": {"id": comment_id}},
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    
    return {"message": "Comment deleted successfully"}

# ============================================================================
# TEAM MEMBER ENDPOINTS
# ============================================================================

@router.post("/{project_id}/team", response_model=TeamMemberResponse)
async def add_team_member(project_id: str, member_data: TeamMemberAdd, admin = Depends(get_current_admin)):
    """Add a team member to project"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    member = TeamMember(**member_data.model_dump())
    member_dict = member.model_dump()
    member_dict['added_at'] = member_dict['added_at'].isoformat()
    
    # Add activity log
    activity = log_activity(
        project_id,
        "team_member_added",
        f"{member_data.admin_name} added to team",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$push": {
                "team_members": member_dict,
                "activity_log": activity
            },
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    return TeamMemberResponse(**member_dict)

@router.delete("/{project_id}/team/{admin_id}")
async def remove_team_member(project_id: str, admin_id: str, admin = Depends(get_current_admin)):
    """Remove a team member from project"""
    result = await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$pull": {"team_members": {"admin_id": admin_id}},
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found")
    
    return {"message": "Team member removed successfully"}

# ============================================================================
# BUDGET ENDPOINTS
# ============================================================================

@router.put("/{project_id}/budget", response_model=BudgetResponse)
async def update_budget(project_id: str, budget_data: BudgetUpdate, admin = Depends(get_current_admin)):
    """Update project budget"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    # Get current budget, handle None case
    current_budget = project_doc.get('budget')
    if current_budget is None:
        current_budget = {}
    
    if budget_data.total_amount is not None:
        current_budget['total_amount'] = budget_data.total_amount
    if budget_data.currency is not None:
        current_budget['currency'] = budget_data.currency
    if budget_data.paid_amount is not None:
        current_budget['paid_amount'] = budget_data.paid_amount
    if budget_data.payment_terms is not None:
        current_budget['payment_terms'] = budget_data.payment_terms
    
    # Calculate pending amount
    current_budget['pending_amount'] = current_budget.get('total_amount', 0) - current_budget.get('paid_amount', 0)
    
    # Add activity log
    activity = log_activity(
        project_id,
        "budget_updated",
        "Project budget updated",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$set": {
                "budget": current_budget,
                "last_activity_at": datetime.utcnow().isoformat()
            },
            "$push": {"activity_log": activity}
        }
    )
    
    return BudgetResponse(**current_budget)

# ============================================================================
# FILE ENDPOINTS
# ============================================================================

@router.post("/{project_id}/files", response_model=FileUploadResponse)
async def upload_project_file(
    project_id: str,
    file: UploadFile = File(...),
    admin = Depends(get_current_admin)
):
    """Upload a file to a project (Admin only)"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Validate file extension and magic signature
    ext, safe_orig_name = validate_file_security(file)

    # Create project-specific directory
    project_dir = Path(UPLOAD_DIR) / project_id
    project_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename safely
    file_id, safe_target_path = generate_secure_path(project_dir, ext)
    file_path = str(safe_target_path)
    
    # Save file in streaming chunks to enforce size limit safely
    file_size = 0
    try:
        with open(safe_target_path, "wb") as buffer:
            while chunk := file.file.read(65536):
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE_BYTES:
                    buffer.close()
                    if safe_target_path.exists():
                        os.remove(safe_target_path)
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="File exceeds maximum allowed size of 15MB."
                    )
                buffer.write(chunk)
    except HTTPException:
        raise
    except Exception as e:
        if safe_target_path.exists():
            os.remove(safe_target_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    
    # Create file metadata
    project_file = ProjectFile(
        id=file_id,
        filename=safe_orig_name,
        file_path=file_path,
        uploaded_by=admin["id"],
        file_size=file_size,
        file_type=file.content_type
    )
    
    file_dict = project_file.model_dump()
    file_dict['uploaded_at'] = file_dict['uploaded_at'].isoformat()
    
    # Add activity log
    activity = log_activity(
        project_id,
        "file_uploaded",
        f"File '{file.filename}' uploaded",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    # Add file to project
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$push": {
                "files": file_dict,
                "activity_log": activity
            },
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    return FileUploadResponse(
        id=file_id,
        filename=file.filename,
        message="File uploaded successfully"
    )

@router.delete("/{project_id}/files/{file_id}")
async def delete_project_file(
    project_id: str,
    file_id: str,
    admin = Depends(get_current_admin)
):
    """Delete a file from a project (Admin only)"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Find file in project
    file_to_delete = None
    for file_info in project_doc.get('files', []):
        if file_info['id'] == file_id:
            file_to_delete = file_info
            break
    
    if not file_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Delete file from filesystem
    file_path = file_to_delete['file_path']
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete file: {str(e)}"
            )
    
    # Add activity log
    activity = log_activity(
        project_id,
        "file_deleted",
        f"File '{file_to_delete['filename']}' deleted",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    # Remove file from project
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$pull": {"files": {"id": file_id}},
            "$push": {"activity_log": activity},
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    return {"message": "File deleted successfully"}

# ============================================================================
# CHAT ENDPOINTS (Admin)
# ============================================================================

@router.post("/{project_id}/chat", response_model=ChatMessageResponse)
async def send_chat_message(project_id: str, message_data: ChatMessageCreate, admin = Depends(get_current_admin)):
    """Send a chat message to client (Admin)"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    chat_message = ChatMessage(
        sender_id=admin["id"],
        sender_name=admin.get("username", "Admin"),
        sender_type="admin",
        message=message_data.message,
        read=False
    )
    
    message_dict = chat_message.model_dump()
    message_dict['created_at'] = message_dict['created_at'].isoformat()
    
    # Add activity log
    activity = log_activity(
        project_id,
        "chat_message",
        f"{admin.get('username', 'Admin')} sent a chat message",
        admin["id"],
        admin.get("username", "Admin")
    )
    activity['timestamp'] = activity['timestamp'].isoformat()
    
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$push": {
                "chat_messages": message_dict,
                "activity_log": activity
            },
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    return ChatMessageResponse(**message_dict)

@router.get("/{project_id}/chat", response_model=List[ChatMessageResponse])
async def get_chat_messages(project_id: str, admin = Depends(get_current_admin)):
    """Get all chat messages for a project (Admin)"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    # Mark admin messages as read
    chat_messages = project_doc.get('chat_messages', [])
    updated = False
    for msg in chat_messages:
        if msg['sender_type'] == 'client' and not msg.get('read', False):
            msg['read'] = True
            updated = True
    
    if updated:
        await client_projects_collection.update_one(
            {"id": project_id},
            {"$set": {"chat_messages": chat_messages}}
        )
    
    return [
        ChatMessageResponse(
            id=cm['id'],
            sender_id=cm['sender_id'],
            sender_name=cm['sender_name'],
            sender_type=cm['sender_type'],
            message=cm['message'],
            read=cm.get('read', False),
            created_at=cm['created_at'] if isinstance(cm['created_at'], str) else cm['created_at'].isoformat()
        ) for cm in chat_messages
    ]

@router.get("/{project_id}/unread-count")
async def get_unread_count(project_id: str, admin = Depends(get_current_admin)):
    """Get count of unread messages from client (Admin)"""
    project_doc = await client_projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    chat_messages = project_doc.get('chat_messages', [])
    unread_count = sum(1 for msg in chat_messages if msg['sender_type'] == 'client' and not msg.get('read', False))
    
    return {"unread_count": unread_count}

