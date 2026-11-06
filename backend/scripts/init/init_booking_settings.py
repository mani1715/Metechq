"""
Initialize default booking settings for testing
"""

import sys
from pathlib import Path
from dotenv import load_dotenv

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
load_dotenv(BACKEND_DIR / ".env")

import asyncio
import uuid
from datetime import datetime
import pytz
from database import booking_settings_collection

IST = pytz.timezone('Asia/Kolkata')

async def init_booking_settings():
    """Create default booking settings if none exist"""
    
    # Check if settings already exist
    existing = await booking_settings_collection.find_one({})
    
    if existing:
        print("✅ Booking settings already exist")
        return
    
    now = datetime.now(IST).isoformat()
    
    default_settings = {
        "id": str(uuid.uuid4()),
        "available_days": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
        ],
        "time_slots": [
            {"start_time": "10:00", "end_time": "11:00", "max_bookings": 1},
            {"start_time": "11:00", "end_time": "12:00", "max_bookings": 1},
            {"start_time": "14:00", "end_time": "15:00", "max_bookings": 1},
            {"start_time": "15:00", "end_time": "16:00", "max_bookings": 1},
            {"start_time": "16:00", "end_time": "17:00", "max_bookings": 1}
        ],
        "meeting_type": "Google Meet",
        "timezone": "Asia/Kolkata",
        "is_active": True,
        "created_at": now,
        "updated_at": now
    }
    
    await booking_settings_collection.insert_one(default_settings)
    print("✅ Default booking settings created!")
    print("   Available Days: Monday - Friday")
    print("   Time Slots: 10:00-17:00 (IST)")
    print("   Meeting Type: Google Meet")
    print("   Status: Active")

if __name__ == "__main__":
    asyncio.run(init_booking_settings())
