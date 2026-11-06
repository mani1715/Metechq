from pydantic import BaseModel, Field, validator, EmailStr
from typing import Optional
from datetime import datetime


class TestimonialCreate(BaseModel):
    """Schema for creating a new testimonial (Admin)"""
    name: str = Field(..., min_length=1, max_length=100)
    role: Optional[str] = Field(None, max_length=100)
    company: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    message: str = Field(..., min_length=1, max_length=1000)
    rating: int = Field(..., ge=1, le=5)
    image: Optional[str] = None
    status: str = Field(default="pending")
    source: str = Field(default="admin_created")
    verified: bool = Field(default=False)

    @validator('status')
    def validate_status(cls, v):
        if v not in ["pending", "approved", "rejected"]:
            raise ValueError('Status must be either "pending", "approved", or "rejected"')
        return v

    @validator('source')
    def validate_source(cls, v):
        valid_sources = ["client_portal", "public_submitted", "admin_created", "email", "social_media"]
        if v not in valid_sources:
            raise ValueError(f'Source must be one of: {", ".join(valid_sources)}')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "role": "CEO",
                "company": "Tech Company",
                "email": "john@example.com",
                "message": "Excellent service and professional work!",
                "rating": 5,
                "image": "https://example.com/avatar.jpg",
                "status": "pending",
                "source": "admin_created",
                "verified": False
            }
        }


class TestimonialSubmit(BaseModel):
    """Schema for customer testimonial submission (Public)"""
    name: str = Field(..., min_length=2, max_length=100, description="Your full name")
    role: Optional[str] = Field(None, max_length=100, description="Your job title")
    company: Optional[str] = Field(None, max_length=100, description="Your company name")
    email: Optional[EmailStr] = Field(None, description="Your email (optional, for verification)")
    message: str = Field(..., min_length=10, max_length=1000, description="Your review/testimonial")
    rating: int = Field(..., ge=1, le=5, description="Rating from 1-5 stars")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Jane Smith",
                "role": "Marketing Director",
                "company": "ABC Corp",
                "email": "jane@abccorp.com",
                "message": "Working with METECHQ was an amazing experience. They delivered exactly what we needed!",
                "rating": 5
            }
        }


class TestimonialUpdate(BaseModel):
    """Schema for updating an existing testimonial"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[str] = Field(None, max_length=100)
    company: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    message: Optional[str] = Field(None, min_length=1, max_length=1000)
    rating: Optional[int] = Field(None, ge=1, le=5)
    image: Optional[str] = None
    status: Optional[str] = None
    source: Optional[str] = None
    verified: Optional[bool] = None

    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in ["pending", "approved", "rejected"]:
            raise ValueError('Status must be either "pending", "approved", or "rejected"')
        return v

    @validator('source')
    def validate_source(cls, v):
        if v is not None:
            valid_sources = ["customer_submitted", "admin_created", "email", "social_media"]
            if v not in valid_sources:
                raise ValueError(f'Source must be one of: {", ".join(valid_sources)}')
        return v


class TestimonialResponse(BaseModel):
    """Schema for testimonial response"""
    id: str
    name: str
    role: Optional[str] = None
    company: Optional[str] = None
    email: Optional[str] = None
    message: str
    rating: int
    image: Optional[str] = None
    status: str
    source: str = "admin_created"
    verified: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "name": "John Doe",
                "role": "CEO",
                "company": "Tech Company",
                "email": "john@example.com",
                "message": "Excellent service and professional work!",
                "rating": 5,
                "image": "https://example.com/avatar.jpg",
                "status": "approved",
                "source": "customer_submitted",
                "verified": True,
                "created_at": "2024-01-01T00:00:00.000000",
                "updated_at": "2024-01-01T00:00:00.000000"
            }
        }
