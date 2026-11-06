from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(__import__('uuid').uuid4()))
    name: str
    email: EmailStr
    password_hash: str
    role: str = "admin"  # admin or editor
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Admin User",
                "email": "admin@metechq.com",
                "role": "admin"
            }
        }
