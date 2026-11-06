from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from database import services_collection
from utils import serialize_document
from auth.admin_auth import get_current_admin
from models import Service
from datetime import datetime

router = APIRouter(prefix="/services", tags=["services"])

@router.get("/", response_model=List[ServiceResponse])
async def get_services():
    """Get all services (public endpoint)"""
    cursor = services_collection.find().sort("order", 1)
    services = await cursor.to_list(length=100)
    return [serialize_document(service) for service in services]

@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: str):
    """Get a specific service by ID (public endpoint)"""
    service = await services_collection.find_one({"id": service_id})
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    return serialize_document(service)

@router.post("/", response_model=ServiceResponse)
async def create_service(service_data: ServiceCreate, admin: dict = Depends(get_current_admin)):
    """Create a new service (admin only)"""
    service = Service(**service_data.model_dump())
    doc = service.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await services_collection.insert_one(doc)
    return serialize_document(doc)

@router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: str,
    service_data: ServiceUpdate,
    admin: dict = Depends(get_current_admin)
):
    """Update a service (admin only)"""
    # Check if service exists
    existing = await services_collection.find_one({"id": service_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    # Update only provided fields
    update_data = service_data.model_dump(exclude_unset=True)
    update_data['updated_at'] = datetime.utcnow().isoformat()
    
    await services_collection.update_one(
        {"id": service_id},
        {"$set": update_data}
    )
    
    updated_service = await services_collection.find_one({"id": service_id})
    return serialize_document(updated_service)

@router.delete("/{service_id}")
async def delete_service(service_id: str, admin: dict = Depends(get_current_admin)):
    """Delete a service (admin only)"""
    result = await services_collection.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    return {"message": "Service deleted successfully"}
