from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import FileResponse
from typing import List
from schemas.client_project import (
    ClientProjectResponse, CommentCreate, CommentResponse,
    MilestoneResponse, TaskResponse, ProjectFileResponse,
    ActivityResponse, TeamMemberResponse, BudgetResponse,
    ChatMessageCreate, ChatMessageResponse
)
from database import client_projects_collection
from auth.client_auth import get_current_client
from models.client_project import ProjectComment, ProjectActivity
from models.client_project import ChatMessage
from datetime import datetime
import os
from pathlib import Path
from config import UPLOAD_DIR

router = APIRouter(prefix="/client/projects", tags=["client-projects"])

def convert_project_to_response(project_doc) -> ClientProjectResponse:
    """Helper function to convert project document to response"""
    from datetime import datetime
    
    # Helper function to safely get datetime string
    def get_datetime_str(obj, key, default=None):
        val = obj.get(key)
        if not val:
            return default
        if isinstance(val, str):
            return val
        return val.isoformat()
    
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
                id=m.get('id', str(i)),
                title=m.get('title', ''),
                description=m.get('description'),
                due_date=str(m['due_date']) if m.get('due_date') else None,
                status=m.get('status', 'pending'),
                completion_date=m.get('completion_date'),
                order=m.get('order', 0),
                created_at=get_datetime_str(m, 'created_at', datetime.utcnow().isoformat())
            ) for i, m in enumerate(project_doc.get('milestones', []))
        ],
        tasks=[
            TaskResponse(
                id=t.get('id', str(i)),
                title=t.get('title', ''),
                description=t.get('description'),
                status=t.get('status', 'todo'),
                priority=t.get('priority', 'medium'),
                assigned_to=t.get('assigned_to'),
                due_date=str(t['due_date']) if t.get('due_date') else None,
                completed_at=t.get('completed_at'),
                milestone_id=t.get('milestone_id'),
                created_at=get_datetime_str(t, 'created_at', datetime.utcnow().isoformat())
            ) for i, t in enumerate(project_doc.get('tasks', []))
        ],
        files=[
            ProjectFileResponse(
                id=f.get('id', str(i)),
                filename=f.get('filename', 'file'),
                file_path=f.get('file_path', ''),
                uploaded_at=get_datetime_str(f, 'uploaded_at', datetime.utcnow().isoformat()),
                uploaded_by=f.get('uploaded_by', 'system'),
                file_size=f.get('file_size', 0),
                file_type=f.get('file_type')
            ) for i, f in enumerate(project_doc.get('files', []))
        ],
        comments=[
            CommentResponse(
                id=c.get('id', str(i)),
                user_id=c.get('user_id', ''),
                user_name=c.get('user_name', 'User'),
                user_type=c.get('user_type', 'client'),
                message=c.get('message', ''),
                created_at=get_datetime_str(c, 'created_at', datetime.utcnow().isoformat())
            ) for i, c in enumerate(project_doc.get('comments', []))
        ],
        chat_messages=[
            ChatMessageResponse(
                id=cm.get('id', str(i)),
                sender_id=cm.get('sender_id', ''),
                sender_name=cm.get('sender_name', 'User'),
                sender_type=cm.get('sender_type', 'client'),
                message=cm.get('message', ''),
                read=cm.get('read', False),
                created_at=get_datetime_str(cm, 'created_at', datetime.utcnow().isoformat())
            ) for i, cm in enumerate(project_doc.get('chat_messages', []))
        ],
        activity_log=[
            ActivityResponse(
                id=a.get('id', str(i)),
                action=a.get('action', 'unknown'),
                description=a.get('description', ''),
                user_id=a.get('user_id', ''),
                user_name=a.get('user_name', 'System'),
                timestamp=get_datetime_str(a, 'timestamp', datetime.utcnow().isoformat()),
                metadata=a.get('metadata')
            ) for i, a in enumerate(project_doc.get('activity_log', []))
        ],
        team_members=[
            TeamMemberResponse(
                admin_id=tm.get('admin_id', ''),
                admin_name=tm.get('admin_name', 'Admin'),
                role=tm.get('role'),
                added_at=get_datetime_str(tm, 'added_at', datetime.utcnow().isoformat())
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
        created_at=get_datetime_str(project_doc, 'created_at', datetime.utcnow().isoformat()),
        updated_at=project_doc.get('updated_at'),
        last_activity_at=project_doc.get('last_activity_at')
    )

@router.get("/", response_model=List[ClientProjectResponse])
async def get_my_projects(client = Depends(get_current_client)):
    """Get all projects assigned to the current client"""
    projects = []
    async for project_doc in client_projects_collection.find({"client_id": client["id"]}):
        projects.append(convert_project_to_response(project_doc))
    return projects

@router.get("/{project_id}", response_model=ClientProjectResponse)
async def get_project(project_id: str, client = Depends(get_current_client)):
    """Get a specific project (only if assigned to current client)"""
    project_doc = await client_projects_collection.find_one({
        "id": project_id,
        "client_id": client["id"]
    })
    
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or not assigned to you"
        )
    
    return convert_project_to_response(project_doc)

@router.post("/{project_id}/comments", response_model=CommentResponse)
async def add_comment(project_id: str, comment_data: CommentCreate, client = Depends(get_current_client)):
    """Add a comment to project (Client)"""
    project_doc = await client_projects_collection.find_one({
        "id": project_id,
        "client_id": client["id"]
    })
    
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or not assigned to you"
        )
    
    comment = ProjectComment(
        user_id=client["id"],
        user_name=client.get("name", "Client"),
        user_type="client",
        message=comment_data.message
    )
    
    comment_dict = comment.model_dump()
    comment_dict['created_at'] = comment_dict['created_at'].isoformat()
    
    # Add activity log
    activity = ProjectActivity(
        action="comment_added",
        description=f"{client.get('name', 'Client')} added a comment",
        user_id=client["id"],
        user_name=client.get("name", "Client")
    )
    activity_dict = activity.model_dump()
    activity_dict['timestamp'] = activity_dict['timestamp'].isoformat()
    
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$push": {
                "comments": comment_dict,
                "activity_log": activity_dict
            },
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    return CommentResponse(**comment_dict)

@router.get("/{project_id}/files/{file_id}/download")
async def download_project_file(
    project_id: str,
    file_id: str,
    client = Depends(get_current_client)
):
    """Download a file from a project (only if project is assigned to current client)"""
    # Verify project belongs to client
    project_doc = await client_projects_collection.find_one({
        "id": project_id,
        "client_id": client["id"]
    })
    
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or not assigned to you"
        )
    
    # Find file in project
    file_info = None
    for f in project_doc.get('files', []):
        if f['id'] == file_id:
            file_info = f
            break
    
    if not file_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    file_path = Path(file_info['file_path']).resolve()
    if not file_path.is_relative_to((UPLOAD_DIR / 'client_projects').resolve()):
        raise HTTPException(status_code=404, detail="File not found")
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on server"
        )
    
    return FileResponse(
        path=file_path,
        filename=file_info['filename'],
        media_type='application/octet-stream'
    )

# ============================================================================
# CHAT ENDPOINTS (Client)
# ============================================================================

@router.post("/{project_id}/chat", response_model=ChatMessageResponse)
async def send_chat_message(project_id: str, message_data: ChatMessageCreate, client = Depends(get_current_client)):
    """Send a chat message to admin (Client)"""
    project_doc = await client_projects_collection.find_one({
        "id": project_id,
        "client_id": client["id"]
    })
    
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or not assigned to you"
        )
    
    chat_message = ChatMessage(
        sender_id=client["id"],
        sender_name=client.get("name", "Client"),
        sender_type="client",
        message=message_data.message,
        read=False
    )
    
    message_dict = chat_message.model_dump()
    message_dict['created_at'] = message_dict['created_at'].isoformat()
    
    # Add activity log
    activity = ProjectActivity(
        action="chat_message",
        description=f"{client.get('name', 'Client')} sent a chat message",
        user_id=client["id"],
        user_name=client.get("name", "Client")
    )
    activity_dict = activity.model_dump()
    activity_dict['timestamp'] = activity_dict['timestamp'].isoformat()
    
    await client_projects_collection.update_one(
        {"id": project_id},
        {
            "$push": {
                "chat_messages": message_dict,
                "activity_log": activity_dict
            },
            "$set": {"last_activity_at": datetime.utcnow().isoformat()}
        }
    )
    
    return ChatMessageResponse(**message_dict)

@router.get("/{project_id}/chat", response_model=List[ChatMessageResponse])
async def get_chat_messages(project_id: str, client = Depends(get_current_client)):
    """Get all chat messages for a project (Client)"""
    project_doc = await client_projects_collection.find_one({
        "id": project_id,
        "client_id": client["id"]
    })
    
    if not project_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or not assigned to you"
        )
    
    # Mark client messages as read
    chat_messages = project_doc.get('chat_messages', [])
    updated = False
    for msg in chat_messages:
        if msg['sender_type'] == 'admin' and not msg.get('read', False):
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

