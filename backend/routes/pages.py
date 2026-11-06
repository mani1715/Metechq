from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any
from schemas.page_content import PageContentCreate, PageContentUpdate, PageContentResponse
from database import page_content_collection
from utils import serialize_document
from auth.admin_auth import get_current_admin
from models import PageContent
from datetime import datetime

router = APIRouter(prefix="/pages", tags=["pages"])

@router.get("/{page_name}")
async def get_page_content(page_name: str):
    """Get all content sections for a specific page (public endpoint)"""
    cursor = page_content_collection.find({"page": page_name})
    sections = await cursor.to_list(length=100)
    
    # Organize by section
    result = {}
    for section_doc in sections:
        section_doc = serialize_document(section_doc)
        section_name = section_doc['section']
        result[section_name] = section_doc['content']
    
    return result

@router.put("/{page_name}")
async def update_page_content(
    page_name: str,
    content: Dict[str, Any],
    admin: dict = Depends(get_current_admin)
):
    """Update page content (admin only)"""
    # Update or create each section
    for section_name, section_content in content.items():
        # Check if section exists
        existing = await page_content_collection.find_one({
            "page": page_name,
            "section": section_name
        })
        
        if existing:
            # Update existing section
            await page_content_collection.update_one(
                {"page": page_name, "section": section_name},
                {"$set": {
                    "content": section_content,
                    "updated_at": datetime.utcnow().isoformat()
                }}
            )
        else:
            # Create new section
            page_content = PageContent(
                page=page_name,
                section=section_name,
                content=section_content
            )
            doc = page_content.model_dump()
            doc['updated_at'] = doc['updated_at'].isoformat()
            await page_content_collection.insert_one(doc)
    
    return {"message": "Page content updated successfully"}

@router.post("/")
async def create_page_section(
    page_data: PageContentCreate,
    admin: dict = Depends(get_current_admin)
):
    """Create a new page section (admin only)"""
    page_content = PageContent(**page_data.model_dump())
    doc = page_content.model_dump()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await page_content_collection.insert_one(doc)
    return serialize_document(doc)
