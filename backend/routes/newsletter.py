from auth.admin_auth import require_permission
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from schemas.newsletter import NewsletterSubscribe, NewsletterResponse, NewsletterUpdate
from database import newsletter_collection
from utils import serialize_document
from models.newsletter import NewsletterSubscriber
from datetime import datetime
from auth.admin_auth import get_current_admin

router = APIRouter(prefix="/newsletter", tags=["newsletter"])

@router.post("/subscribe", response_model=dict)
async def subscribe_to_newsletter(subscription_data: NewsletterSubscribe):
    """Subscribe to newsletter (public endpoint)"""
    # Check if email already exists
    existing = await newsletter_collection.find_one({"email": subscription_data.email})
    
    if existing:
        # If already subscribed
        if existing.get("status") == "subscribed":
            return {
                "message": "This email is already subscribed to our newsletter",
                "status": "already_subscribed"
            }
        # If previously unsubscribed, resubscribe
        else:
            await newsletter_collection.update_one(
                {"email": subscription_data.email},
                {"$set": {"status": "subscribed", "created_at": datetime.utcnow()}}
            )
            return {
                "message": "Successfully resubscribed to newsletter!",
                "status": "resubscribed"
            }
    
    # Create new subscriber
    subscriber = NewsletterSubscriber(**subscription_data.model_dump())
    doc = subscriber.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await newsletter_collection.insert_one(doc)
    return {
        "message": "Successfully subscribed to newsletter!",
        "status": "subscribed"
    }

@router.get("/admin/all", response_model=List[NewsletterResponse])
async def get_all_subscribers(admin = Depends(require_permission("canManageNewsletter"))):
    """Get all newsletter subscribers (admin only)"""
    cursor = newsletter_collection.find().sort("created_at", -1)
    subscribers = await cursor.to_list(length=10000)
    return [serialize_document(subscriber) for subscriber in subscribers]

@router.delete("/admin/{subscriber_id}")
async def delete_subscriber(subscriber_id: str, admin = Depends(require_permission("canManageNewsletter"))):
    """Delete a newsletter subscriber (admin only)"""
    result = await newsletter_collection.delete_one({"id": subscriber_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscriber not found"
        )
    return {"message": "Subscriber deleted successfully"}

@router.get("/admin/export")
async def export_subscribers(admin = Depends(require_permission("canManageNewsletter"))):
    """Export all subscribers as CSV (admin only)"""
    cursor = newsletter_collection.find().sort("created_at", -1)
    subscribers = await cursor.to_list(length=10000)
    
    # Create CSV content
    csv_lines = ["Email,Status,Subscribed Date"]
    for subscriber in subscribers:
        email = subscriber.get("email", "")
        status = subscriber.get("status", "subscribed")
        created_at = subscriber.get("created_at", "")
        csv_lines.append(f"{email},{status},{created_at}")
    
    csv_content = "\n".join(csv_lines)
    
    return {
        "csv": csv_content,
        "count": len(subscribers)
    }
