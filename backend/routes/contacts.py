from auth.admin_auth import require_permission
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from schemas.contact import ContactCreate, ContactResponse, ContactUpdate
from database import contacts_collection
from utils import serialize_document
from auth.admin_auth import get_current_admin
from models import ContactSubmission
from datetime import datetime

router = APIRouter(prefix="/contacts", tags=["contacts"])

@router.post("/", response_model=ContactResponse)
async def create_contact(contact_data: ContactCreate):
    """Create a new contact submission (public endpoint)"""
    contact = ContactSubmission(**contact_data.model_dump())
    doc = contact.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await contacts_collection.insert_one(doc)
    return serialize_document(doc)

@router.get("/admin/all", response_model=List[ContactResponse])
async def get_all_contacts(admin: dict = Depends(require_permission("canViewContacts"))):
    """Get all contact submissions (admin only)"""
    cursor = contacts_collection.find().sort("created_at", -1)
    contacts = await cursor.to_list(length=1000)
    return [serialize_document(contact) for contact in contacts]

@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(contact_id: str, admin: dict = Depends(require_permission("canViewContacts"))):
    """Get a specific contact submission (admin only)"""
    contact = await contacts_collection.find_one({"id": contact_id})
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    return serialize_document(contact)

@router.patch("/{contact_id}/read", response_model=ContactResponse)
async def mark_contact_read(contact_id: str, update_data: ContactUpdate, admin: dict = Depends(require_permission("canViewContacts"))):
    """Mark a contact as read/unread (admin only)"""
    existing = await contacts_collection.find_one({"id": contact_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    
    await contacts_collection.update_one(
        {"id": contact_id},
        {"$set": {"read": update_data.read}}
    )
    
    updated_contact = await contacts_collection.find_one({"id": contact_id})
    return serialize_document(updated_contact)

@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(contact_id: str, contact_data: ContactCreate, admin: dict = Depends(require_permission("canViewContacts"))):
    """Update a contact submission (admin only)"""
    existing = await contacts_collection.find_one({"id": contact_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    
    update_dict = contact_data.model_dump(exclude_unset=True)
    
    await contacts_collection.update_one(
        {"id": contact_id},
        {"$set": update_dict}
    )
    
    updated_contact = await contacts_collection.find_one({"id": contact_id})
    return serialize_document(updated_contact)

@router.delete("/{contact_id}")
async def delete_contact(contact_id: str, admin: dict = Depends(require_permission("canViewContacts"))):
    """Delete a contact submission (admin only)"""
    result = await contacts_collection.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    return {"message": "Contact deleted successfully"}
