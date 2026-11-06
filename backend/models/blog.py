from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Blog(BaseModel):
    id: str = Field(default_factory=lambda: str(__import__('uuid').uuid4()))
    title: str
    slug: str
    content: str  # HTML/rich text content
    excerpt: str
    cover_image: str  # URL to cover image
    category: str
    tags: List[str] = []
    author: str = "METECHQ"
    status: str = "draft"  # draft or published
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Getting Started with React",
                "slug": "getting-started-with-react",
                "content": "<p>This is the blog content...</p>",
                "excerpt": "Learn how to get started with React in this comprehensive guide",
                "cover_image": "https://example.com/blog-image.jpg",
                "category": "Web Development",
                "tags": ["React", "JavaScript", "Frontend"],
                "author": "METECHQ",
                "status": "published",
                "seo_title": "Getting Started with React - A Complete Guide",
                "seo_description": "Learn React from scratch with this step-by-step guide"
            }
        }
