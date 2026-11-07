from auth.admin_auth import require_permission
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from datetime import datetime
import uuid
import pytz
from database import booking_settings_collection
from schemas.booking_setting import (
    BookingSettingCreate,
    BookingSettingUpdate,
    BookingSettingResponse
)
from auth.admin_auth import get_current_admin

router = APIRouter(prefix="/booking-settings", tags=["booking-settings"])

# IST timezone
IST = pytz.timezone('Asia/Kolkata')

def get_ist_now():
    """Get current time in IST"""
    return datetime.now(IST)

@router.get("/", response_model=Optional[BookingSettingResponse])
async def get_booking_settings():
    """Get active booking settings (PUBLIC)"""
    settings = await booking_settings_collection.find_one({"is_active": True})
    return settings

@router.get("/admin", response_model=Optional[BookingSettingResponse])
async def get_booking_settings_admin(_: dict = Depends(require_permission("canManageBookingSettings"))):
    """Get booking settings (ADMIN)"""
    settings = await booking_settings_collection.find_one({})
    return settings

@router.post("/admin", response_model=BookingSettingResponse)
async def create_booking_settings(
    settings: BookingSettingCreate,
    _: dict = Depends(require_permission("canManageBookingSettings"))
):
    """Create or update booking settings (ADMIN)"""
    # Check if settings already exist
    existing = await booking_settings_collection.find_one({})
    
    now = get_ist_now().isoformat()
    
    settings_data = {
        "available_days": settings.available_days,
        "time_slots": [slot.dict() for slot in settings.time_slots],
        "meeting_type": settings.meeting_type,
        "timezone": "Asia/Kolkata",
        "is_active": settings.is_active,
        "updated_at": now
    }
    
    if existing:
        # Update existing settings
        await booking_settings_collection.update_one(
            {"id": existing["id"]},
            {"$set": settings_data}
        )
        updated = await booking_settings_collection.find_one({"id": existing["id"]})
        return updated
    else:
        # Create new settings
        settings_data["id"] = str(uuid.uuid4())
        settings_data["created_at"] = now
        
        await booking_settings_collection.insert_one(settings_data)
        return settings_data

@router.put("/admin/{settings_id}", response_model=BookingSettingResponse)
async def update_booking_settings(
    settings_id: str,
    settings_update: BookingSettingUpdate,
    _: dict = Depends(require_permission("canManageBookingSettings"))
):
    """Update booking settings (ADMIN)"""
    existing = await booking_settings_collection.find_one({"id": settings_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    update_data = {"updated_at": get_ist_now().isoformat()}
    
    if settings_update.available_days is not None:
        update_data["available_days"] = settings_update.available_days
    
    if settings_update.time_slots is not None:
        update_data["time_slots"] = [slot.dict() for slot in settings_update.time_slots]
    
    if settings_update.meeting_type is not None:
        update_data["meeting_type"] = settings_update.meeting_type
    
    if settings_update.is_active is not None:
        update_data["is_active"] = settings_update.is_active
    
    await booking_settings_collection.update_one(
        {"id": settings_id},
        {"$set": update_data}
    )
    
    updated = await booking_settings_collection.find_one({"id": settings_id})
    return updated

@router.delete("/admin/{settings_id}")
async def delete_booking_settings(
    settings_id: str,
    _: dict = Depends(require_permission("canManageBookingSettings"))
):
    """Delete booking settings (ADMIN)"""
    result = await booking_settings_collection.delete_one({"id": settings_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Settings not found")
    return {"message": "Settings deleted successfully"}
