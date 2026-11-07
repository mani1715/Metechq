from auth.admin_auth import require_permission
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from datetime import datetime, timedelta
import uuid
import logging

from database import analytics_collection
from schemas.analytics import (
    AnalyticsEventCreate,
    AnalyticsEventResponse,
    AnalyticsSummary,
    PageViewStats,
    BlogViewStats
)
from auth.admin_auth import get_current_admin

router = APIRouter(prefix="/analytics", tags=["analytics"])
logger = logging.getLogger(__name__)

@router.post("/event", status_code=201)
async def track_event(event: AnalyticsEventCreate):
    """Track an analytics event - public endpoint, fails silently"""
    try:
        event_data = {
            "_id": str(uuid.uuid4()),
            "event_type": event.event_type,
            "page_name": event.page_name,
            "blog_id": event.blog_id,
            "blog_title": event.blog_title,
            "timestamp": datetime.utcnow()
        }
        
        await analytics_collection.insert_one(event_data)
        return {"status": "success", "message": "Event tracked"}
    except Exception as e:
        # Fail silently - don't block user actions
        logger.warning(f"Analytics tracking failed: {str(e)}")
        return {"status": "success", "message": "Event received"}

@router.get("/summary", response_model=AnalyticsSummary)
async def get_analytics_summary(
    period: str = "7days",
    current_admin: dict = Depends(require_permission("canViewAnalytics"))
):
    """Get analytics summary - admin only"""
    try:
        # Calculate date range
        now = datetime.utcnow()
        
        if period == "today":
            start_date = datetime(now.year, now.month, now.day)
        elif period == "7days":
            start_date = now - timedelta(days=7)
        elif period == "30days":
            start_date = now - timedelta(days=30)
        else:
            start_date = now - timedelta(days=7)
        
        # Query filter
        date_filter = {"timestamp": {"$gte": start_date}}
        
        # Get total page views
        total_page_views = await analytics_collection.count_documents({
            **date_filter,
            "event_type": "page_view"
        })
        
        # Get contact submissions
        contact_submissions = await analytics_collection.count_documents({
            **date_filter,
            "event_type": "contact_submission"
        })
        
        # Get calculator usage
        calculator_opened = await analytics_collection.count_documents({
            **date_filter,
            "event_type": "calculator_opened"
        })
        
        calculator_estimates = await analytics_collection.count_documents({
            **date_filter,
            "event_type": "calculator_estimate"
        })
        
        # Get page views by page
        page_views_pipeline = [
            {"$match": {**date_filter, "event_type": "page_view"}},
            {"$group": {
                "_id": "$page_name",
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}}
        ]
        
        page_views_cursor = analytics_collection.aggregate(page_views_pipeline)
        page_views_list = await page_views_cursor.to_list(length=None)
        
        page_views_by_page = [
            PageViewStats(page_name=item["_id"], count=item["count"])
            for item in page_views_list if item["_id"]
        ]
        
        # Get blog views
        blog_views_pipeline = [
            {"$match": {**date_filter, "event_type": "blog_view"}},
            {"$group": {
                "_id": {"blog_id": "$blog_id", "blog_title": "$blog_title"},
                "count": {"$sum": 1}
            }},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        
        blog_views_cursor = analytics_collection.aggregate(blog_views_pipeline)
        blog_views_list = await blog_views_cursor.to_list(length=None)
        
        blog_views = [
            BlogViewStats(
                blog_id=item["_id"]["blog_id"],
                blog_title=item["_id"]["blog_title"] or "Untitled",
                count=item["count"]
            )
            for item in blog_views_list if item["_id"]["blog_id"]
        ]
        
        return AnalyticsSummary(
            total_page_views=total_page_views,
            contact_submissions=contact_submissions,
            calculator_opened=calculator_opened,
            calculator_estimates=calculator_estimates,
            page_views_by_page=page_views_by_page,
            blog_views=blog_views,
            period=period
        )
        
    except Exception as e:
        logger.error(f"Error fetching analytics summary: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
