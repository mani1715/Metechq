from auth.admin_auth import require_permission
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from schemas.blog import BlogCreate, BlogUpdate, BlogResponse
from database import blogs_collection
from utils import serialize_document, create_slug
from models import Blog
from datetime import datetime
from auth.admin_auth import get_current_admin

router = APIRouter(prefix="/blogs", tags=["blogs"])

# ====================================
# PUBLIC ROUTES
# ====================================

@router.get("/", response_model=List[BlogResponse])
async def get_published_blogs():
    """Get all published blogs (public endpoint)"""
    cursor = blogs_collection.find({"status": "published"}).sort("created_at", -1)
    blogs = await cursor.to_list(length=100)
    return [serialize_document(blog) for blog in blogs]

@router.get("/{slug}", response_model=BlogResponse)
async def get_blog_by_slug(slug: str):
    """Get a single published blog by slug (public endpoint)"""
    blog = await blogs_collection.find_one({"slug": slug, "status": "published"})
    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    return serialize_document(blog)

# ====================================
# ADMIN ROUTES (Protected)
# ====================================

@router.get("/admin/all", response_model=List[BlogResponse])
async def get_all_blogs(current_admin: dict = Depends(require_permission("canManageBlogs"))):
    """Get all blogs including drafts (admin only)"""
    cursor = blogs_collection.find().sort("created_at", -1)
    blogs = await cursor.to_list(length=100)
    return [serialize_document(blog) for blog in blogs]

@router.post("/admin/create", response_model=BlogResponse)
async def create_blog(blog_data: BlogCreate, current_admin: dict = Depends(require_permission("canManageBlogs"))):
    """Create a new blog (admin only)"""
    # Auto-generate slug if not provided
    if not blog_data.slug:
        blog_data.slug = create_slug(blog_data.title)
    
    # Check if slug already exists
    existing = await blogs_collection.find_one({"slug": blog_data.slug})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A blog with this slug already exists"
        )
    
    blog = Blog(**blog_data.model_dump())
    doc = blog.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await blogs_collection.insert_one(doc)
    return serialize_document(doc)

@router.put("/admin/{blog_id}", response_model=BlogResponse)
async def update_blog(blog_id: str, blog_data: BlogUpdate, current_admin: dict = Depends(require_permission("canManageBlogs"))):
    """Update a blog (admin only)"""
    # Check if blog exists
    existing = await blogs_collection.find_one({"id": blog_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    
    # Update only provided fields
    update_data = blog_data.model_dump(exclude_unset=True)
    
    # Auto-update slug if title is changed
    if 'title' in update_data and 'slug' not in update_data:
        update_data['slug'] = create_slug(update_data['title'])
    
    # Check if new slug conflicts with another blog
    if 'slug' in update_data:
        slug_conflict = await blogs_collection.find_one({
            "slug": update_data['slug'],
            "id": {"$ne": blog_id}
        })
        if slug_conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A blog with this slug already exists"
            )
    
    update_data['updated_at'] = datetime.utcnow().isoformat()
    
    await blogs_collection.update_one(
        {"id": blog_id},
        {"$set": update_data}
    )
    
    updated_blog = await blogs_collection.find_one({"id": blog_id})
    return serialize_document(updated_blog)

@router.delete("/admin/{blog_id}")
async def delete_blog(blog_id: str, current_admin: dict = Depends(require_permission("canManageBlogs"))):
    """Delete a blog (admin only)"""
    result = await blogs_collection.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found"
        )
    return {"message": "Blog deleted successfully"}
