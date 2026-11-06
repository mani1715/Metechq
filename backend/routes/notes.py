from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from schemas.note import NoteCreate, NoteUpdate, NoteResponse
from database import db
from auth.admin_auth import get_current_admin
from models.note import Note
from datetime import datetime

router = APIRouter(prefix="/notes", tags=["notes"])

# Notes collection
notes_collection = db['notes']

import re

@router.get("/", response_model=List[NoteResponse])
async def get_all_notes(
    search: str = None,
    limit: int = 100,
    skip: int = 0,
    current_admin: dict = Depends(get_current_admin)
):
    """Get all notes with sanitized search and pagination"""
    query = {}
    
    # Add sanitized search filter if provided
    if search and search.strip():
        safe_search = re.escape(search.strip())
        query["$or"] = [
            {"name": {"$regex": safe_search, "$options": "i"}},
            {"content": {"$regex": safe_search, "$options": "i"}},
            {"tags": {"$regex": safe_search, "$options": "i"}}
        ]
    
    # Fetch notes sorted by updated_at with limit protection
    limit_clamped = max(1, min(limit, 500))
    notes = await notes_collection.find(query).sort("updated_at", -1).skip(skip).to_list(limit_clamped)
    
    result = []
    for note in notes:
        result.append({
            "id": note['id'],
            "name": note['name'],
            "content": note['content'],
            "created_at": note['created_at'] if isinstance(note['created_at'], str) else note['created_at'].isoformat(),
            "updated_at": note['updated_at'] if isinstance(note['updated_at'], str) else note['updated_at'].isoformat(),
            "created_by": note.get('created_by', 'admin'),
            "tags": note.get('tags', [])
        })
    
    return result

@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Get a specific note"""
    note = await notes_collection.find_one({"id": note_id})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return {
        "id": note['id'],
        "name": note['name'],
        "content": note['content'],
        "created_at": note['created_at'] if isinstance(note['created_at'], str) else note['created_at'].isoformat(),
        "updated_at": note['updated_at'] if isinstance(note['updated_at'], str) else note['updated_at'].isoformat(),
        "created_by": note.get('created_by', 'admin'),
        "tags": note.get('tags', [])
    }

@router.post("/", response_model=NoteResponse)
async def create_note(
    note_data: NoteCreate,
    current_admin: dict = Depends(get_current_admin)
):
    """Create a new note"""
    # Create new note
    new_note = Note(
        name=note_data.name,
        content=note_data.content,
        tags=note_data.tags or [],
        created_by=current_admin['username']
    )
    
    note_dict = new_note.model_dump()
    note_dict['created_at'] = note_dict['created_at'].isoformat()
    note_dict['updated_at'] = note_dict['updated_at'].isoformat()
    
    await notes_collection.insert_one(note_dict)
    
    return {
        "id": new_note.id,
        "name": new_note.name,
        "content": new_note.content,
        "created_at": note_dict['created_at'],
        "updated_at": note_dict['updated_at'],
        "created_by": new_note.created_by,
        "tags": new_note.tags
    }

@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: str,
    note_data: NoteUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Update a note"""
    note = await notes_collection.find_one({"id": note_id})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Prepare update data
    update_data = note_data.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.utcnow().isoformat()
    
    await notes_collection.update_one(
        {"id": note_id},
        {"$set": update_data}
    )
    
    # Fetch updated note
    updated_note = await notes_collection.find_one({"id": note_id})
    
    return {
        "id": updated_note['id'],
        "name": updated_note['name'],
        "content": updated_note['content'],
        "created_at": updated_note['created_at'] if isinstance(updated_note['created_at'], str) else updated_note['created_at'].isoformat(),
        "updated_at": updated_note['updated_at'] if isinstance(updated_note['updated_at'], str) else updated_note['updated_at'].isoformat(),
        "created_by": updated_note.get('created_by', 'admin'),
        "tags": updated_note.get('tags', [])
    }

@router.delete("/{note_id}")
async def delete_note(
    note_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete a note"""
    result = await notes_collection.delete_one({"id": note_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    
    return {"message": "Note deleted successfully"}
