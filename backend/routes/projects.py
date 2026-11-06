from fastapi import APIRouter, HTTPException, status, Depends, Header
from typing import List, Optional
from schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from database import projects_collection
from utils import serialize_document, create_slug
from models import Project
from datetime import datetime
from auth.admin_auth import get_current_admin
from auth.jwt import decode_access_token

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/", response_model=List[ProjectResponse])
async def get_projects():
    """Get public projects only (for public portfolio page)"""
    cursor = projects_collection.find({"is_private": {"$ne": True}}).sort("created_at", -1)
    projects = await cursor.to_list(length=100)
    return [serialize_document(project) for project in projects]

@router.get("/all", response_model=List[ProjectResponse])
async def get_all_projects(current_admin: dict = Depends(get_current_admin)):
    """Get all projects including private ones (admin only)"""
    cursor = projects_collection.find().sort("created_at", -1)
    projects = await cursor.to_list(length=100)
    return [serialize_document(project) for project in projects]

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, authorization: Optional[str] = Header(None)):
    """Get a specific project by ID (private projects require admin authorization)"""
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check if project is private
    if project.get("is_private", False):
        is_admin = False
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split()[1]
            payload = decode_access_token(token)
            if payload and payload.get("role") in ["admin", "super_admin"]:
                is_admin = True
        
        if not is_admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
            
    return serialize_document(project)

@router.post("/", response_model=ProjectResponse)
async def create_project(project_data: ProjectCreate, current_admin: dict = Depends(get_current_admin)):
    """Create a new project (admin only)"""
    # Auto-generate slug if not provided
    if not project_data.slug:
        project_data.slug = create_slug(project_data.title)
    
    project = Project(**project_data.model_dump())
    doc = project.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await projects_collection.insert_one(doc)
    return serialize_document(doc)

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Update a project (admin only)"""
    # Check if project exists
    existing = await projects_collection.find_one({"id": project_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Update only provided fields
    update_data = project_data.model_dump(exclude_unset=True)
    
    # Auto-update slug if title is changed
    if 'title' in update_data and 'slug' not in update_data:
        update_data['slug'] = create_slug(update_data['title'])
    
    update_data['updated_at'] = datetime.utcnow().isoformat()
    
    await projects_collection.update_one(
        {"id": project_id},
        {"$set": update_data}
    )
    
    updated_project = await projects_collection.find_one({"id": project_id})
    return serialize_document(updated_project)

@router.delete("/{project_id}")
async def delete_project(project_id: str, current_admin: dict = Depends(get_current_admin)):
    """Delete a project (admin only)"""
    result = await projects_collection.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return {"message": "Project deleted successfully"}
