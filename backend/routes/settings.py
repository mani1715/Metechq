from auth.admin_auth import require_permission
from fastapi import APIRouter, HTTPException, status, Depends
from schemas.settings import SettingsUpdate, SettingsResponse
from database import settings_collection
from utils import serialize_document
from auth.admin_auth import get_current_admin
from models import Settings
from datetime import datetime

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("/", response_model=SettingsResponse)
async def get_settings():
    """Get global settings (public endpoint)"""
    settings = await settings_collection.find_one({"id": "global_settings"})
    if not settings:
        # Return default settings if none exist
        default_settings = Settings(
            agency_name="METECHQ",
            owner_name="Maneesh",
            email="info@metechq.com",
            phone="+1234567890",
            social_links={},
            theme={},
            whatsapp_number=None,
            enable_share_buttons=True
        )
        return default_settings.model_dump()
    return serialize_document(settings)

@router.put("/", response_model=SettingsResponse)
async def update_settings(settings_data: SettingsUpdate, admin: dict = Depends(require_permission("canManageSettings"))):
    """Update global settings (admin only)"""
    existing = await settings_collection.find_one({"id": "global_settings"})
    
    update_data = settings_data.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.utcnow().isoformat()
    
    if existing:
        # Update existing settings
        await settings_collection.update_one(
            {"id": "global_settings"},
            {"$set": update_data}
        )
    else:
        # Create new settings
        settings = Settings(
            agency_name=settings_data.agency_name or "METECHQ",
            owner_name=settings_data.owner_name or "Admin",
            email=settings_data.email or "info@metechq.com",
            phone=settings_data.phone or "+1234567890",
            address=settings_data.address,
            description=settings_data.description,
            tagline=settings_data.tagline,
            social_links=settings_data.social_links or {},
            theme=settings_data.theme or {},
            whatsapp_number=settings_data.whatsapp_number,
            enable_share_buttons=settings_data.enable_share_buttons if settings_data.enable_share_buttons is not None else True
        )
        doc = settings.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await settings_collection.insert_one(doc)
    
    updated_settings = await settings_collection.find_one({"id": "global_settings"})
    return serialize_document(updated_settings)
