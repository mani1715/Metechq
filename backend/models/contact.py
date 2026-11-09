from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(__import__('uuid').uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    service: Optional[str] = None
    budget: Optional[str] = None
    consent: Optional[bool] = None
    message: str
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "+1234567890",
                "service": "Web Development",
                "message": "I need a website",
                "read": False
            }
        }
