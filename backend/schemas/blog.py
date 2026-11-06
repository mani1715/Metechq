from pydantic import BaseModel
from typing import List, Optional

class BlogCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    content: str
    excerpt: str
    cover_image: str
    category: str
    tags: List[str] = []
    author: str = "METECHQ"
    status: str = "draft"
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    author: Optional[str] = None
    status: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class BlogResponse(BaseModel):
    id: str
    title: str
    slug: str
    content: str
    excerpt: str
    cover_image: str
    category: str
    tags: List[str]
    author: str
    status: str
    seo_title: Optional[str]
    seo_description: Optional[str]
    created_at: str
    updated_at: str
