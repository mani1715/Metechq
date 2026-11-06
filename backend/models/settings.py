from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Dict
from datetime import datetime

class Settings(BaseModel):
    id: str = Field(default="global_settings")
    agency_name: str
    owner_name: str
    email: EmailStr
    phone: str
    address: Optional[str] = None
    description: Optional[str] = None
    tagline: Optional[str] = None
    social_links: Dict[str, str] = {}
    theme: Dict[str, str] = {}
    whatsapp_number: Optional[str] = None
    enable_share_buttons: bool = True
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "agency_name": "METECHQ",
                "owner_name": "Maneesh",
                "email": "info@metechq.com",
                "phone": "+1234567890",
                "address": "123 Main St, City, Country",
                "social_links": {
                    "facebook": "https://facebook.com/metechq",
                    "twitter": "https://twitter.com/metechq"
                }
            }
        }
