from pydantic import BaseModel, Field
from typing import Optional, Any, Dict
from datetime import datetime

class PageContent(BaseModel):
    id: str = Field(default_factory=lambda: str(__import__('uuid').uuid4()))
    page: str  # home, about, services, contact, portfolio
    section: str  # hero, mission, features, etc.
    content: Dict[str, Any]  # Flexible content structure
    visible: bool = True
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "page": "home",
                "section": "hero",
                "content": {
                    "title": "Welcome to METECHQ",
                    "description": "Professional web development agency"
                },
                "visible": True
            }
        }
