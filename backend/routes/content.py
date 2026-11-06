from fastapi import APIRouter, HTTPException, status, Depends
from schemas.content import ContentUpdate, ContentResponse
from database import content_collection
from utils import serialize_document
from auth.admin_auth import get_current_admin
from models.content import WebsiteContent
from datetime import datetime

router = APIRouter(prefix="/content", tags=["content"])

@router.get("/", response_model=ContentResponse)
async def get_content():
    """Get website content (public endpoint)"""
    content = await content_collection.find_one({"id": "website_content"})
    
    if not content:
        # Create default content if not exists
        default_content = WebsiteContent(id="website_content")
        doc = default_content.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await content_collection.insert_one(doc)
        return serialize_document(doc)
    
    return serialize_document(content)

@router.put("/", response_model=ContentResponse)
async def update_content(content_data: ContentUpdate, admin: dict = Depends(get_current_admin)):
    """Update website content (admin only)"""
    # Check if content exists
    existing = await content_collection.find_one({"id": "website_content"})
    
    if not existing:
        # Create new if doesn't exist
        default_content = WebsiteContent(id="website_content")
        doc = default_content.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await content_collection.insert_one(doc)
        existing = doc
    
    # Update only provided fields
    update_data = content_data.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.utcnow().isoformat()
    
    await content_collection.update_one(
        {"id": "website_content"},
        {"$set": update_data}
    )
    
    updated_content = await content_collection.find_one({"id": "website_content"})
    return serialize_document(updated_content)
