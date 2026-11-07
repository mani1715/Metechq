from auth.admin_auth import require_permission
from fastapi import APIRouter, HTTPException, status, Depends
from schemas.pricing import PricingUpdate, PricingResponse
from database import pricing_collection
from utils import serialize_document
from models.pricing import Pricing, WebsiteType, Technology, Feature, TimelineMultiplier
from datetime import datetime
from auth.admin_auth import get_current_admin

router = APIRouter(prefix="/pricing", tags=["pricing"])

@router.get("/", response_model=PricingResponse)
async def get_pricing():
    """Get pricing configuration (public endpoint)"""
    pricing = await pricing_collection.find_one({"id": "pricing_config"})
    
    if not pricing:
        # Return default pricing if none exist
        default_pricing = Pricing(
            website_types=[
                WebsiteType(name="Business Website", price=25000),
                WebsiteType(name="E-commerce Website", price=50000),
                WebsiteType(name="Portfolio Website", price=15000),
                WebsiteType(name="SaaS / Web App", price=100000)
            ],
            technologies=[
                Technology(name="HTML/CSS", price=0),
                Technology(name="React", price=15000),
                Technology(name="Next.js", price=20000),
                Technology(name="Node.js", price=12000),
                Technology(name="FastAPI", price=12000),
                Technology(name="MongoDB", price=8000),
                Technology(name="MySQL", price=8000)
            ],
            features=[
                Feature(name="Admin Panel", price=15000),
                Feature(name="Blog System", price=10000),
                Feature(name="Authentication", price=8000),
                Feature(name="Payment Gateway", price=12000),
                Feature(name="SEO Optimization", price=5000)
            ],
            timeline_multipliers=[
                TimelineMultiplier(range="7-15 days", multiplier=1.5),
                TimelineMultiplier(range="15-30 days", multiplier=1.0),
                TimelineMultiplier(range="30-60 days", multiplier=0.8)
            ],
            currency="INR",
            currency_symbol="₹"
        )
        
        # Insert default pricing
        doc = default_pricing.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await pricing_collection.insert_one(doc)
        
        return default_pricing.model_dump()
    
    return serialize_document(pricing)

@router.put("/", response_model=PricingResponse)
async def update_pricing(
    pricing_data: PricingUpdate,
    current_admin: dict = Depends(require_permission("canManagePricing"))
):
    """Update pricing configuration (admin only)"""
    existing = await pricing_collection.find_one({"id": "pricing_config"})
    
    update_data = pricing_data.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.utcnow().isoformat()
    
    if existing:
        # Update existing pricing
        await pricing_collection.update_one(
            {"id": "pricing_config"},
            {"$set": update_data}
        )
    else:
        # Create new pricing with defaults
        pricing = Pricing(
            website_types=pricing_data.website_types or [],
            technologies=pricing_data.technologies or [],
            features=pricing_data.features or [],
            timeline_multipliers=pricing_data.timeline_multipliers or [],
            currency=pricing_data.currency or "INR",
            currency_symbol=pricing_data.currency_symbol or "₹"
        )
        doc = pricing.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await pricing_collection.insert_one(doc)
    
    updated_pricing = await pricing_collection.find_one({"id": "pricing_config"})
    return serialize_document(updated_pricing)
