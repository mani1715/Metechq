from auth.admin_auth import require_permission
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from schemas.client import ClientCreate, ClientUpdate, ClientResponse
from database import clients_collection, client_projects_collection
from auth.password import hash_password, validate_password_strength
from auth.admin_auth import get_current_admin
from models.client import Client
from datetime import datetime

router = APIRouter(prefix="/admin/clients", tags=["admin-clients"])

@router.get("/", response_model=List[ClientResponse])
async def get_all_clients(admin = Depends(require_permission("canManageClients"))):
    """Get all clients (Admin only)"""
    clients = []
    async for client_doc in clients_collection.find():
        clients.append(ClientResponse(
            id=client_doc['id'],
            name=client_doc['name'],
            email=client_doc['email'],
            company=client_doc.get('company'),
            phone=client_doc.get('phone'),
            is_active=client_doc.get('is_active', True),
            created_at=client_doc['created_at'] if isinstance(client_doc['created_at'], str) else client_doc['created_at'].isoformat()
        ))
    return clients

@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(client_id: str, admin = Depends(require_permission("canManageClients"))):
    """Get a specific client (Admin only)"""
    client_doc = await clients_collection.find_one({"id": client_id})
    
    if not client_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    return ClientResponse(
        id=client_doc['id'],
        name=client_doc['name'],
        email=client_doc['email'],
        company=client_doc.get('company'),
        phone=client_doc.get('phone'),
        is_active=client_doc.get('is_active', True),
        created_at=client_doc['created_at'] if isinstance(client_doc['created_at'], str) else client_doc['created_at'].isoformat()
    )

@router.get("/{client_id}/projects")
async def get_client_projects_for_admin(client_id: str, admin = Depends(require_permission("canManageClients"))):
    """Get all projects for a specific client (Admin only)"""
    projects = []
    async for p in client_projects_collection.find({"client_id": client_id}):
        p.pop('_id', None)
        projects.append(p)
    return projects

@router.post("/", response_model=ClientResponse)
async def create_client(client_data: ClientCreate, admin = Depends(require_permission("canManageClients"))):
    """Create a new client with password validation (Admin only)"""
    # Validate password strength
    valid_pw, pw_err = validate_password_strength(client_data.password)
    if not valid_pw:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=pw_err
        )

    # Check if email already exists
    normalized_email = client_data.email.strip().lower()
    existing_client = await clients_collection.find_one({"email": normalized_email})
    if existing_client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create client
    client = Client(
        name=client_data.name.strip(),
        email=normalized_email,
        password_hash=hash_password(client_data.password),
        company=client_data.company.strip() if client_data.company else None,
        phone=client_data.phone.strip() if client_data.phone else None,
        is_active=client_data.is_active,
        created_by=admin["id"]
    )
    
    client_dict = client.model_dump()
    client_dict['created_at'] = client_dict['created_at'].isoformat()
    
    await clients_collection.insert_one(client_dict)
    
    return ClientResponse(
        id=client.id,
        name=client.name,
        email=client.email,
        company=client.company,
        phone=client.phone,
        is_active=client.is_active,
        created_at=client_dict['created_at']
    )

@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(client_id: str, client_data: ClientUpdate, admin = Depends(require_permission("canManageClients"))):
    """Update a client (Admin only)"""
    client_doc = await clients_collection.find_one({"id": client_id})
    
    if not client_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Prepare update data
    update_data = {}
    if client_data.name is not None:
        update_data['name'] = client_data.name.strip()
    if client_data.email is not None:
        normalized_email = client_data.email.strip().lower()
        existing = await clients_collection.find_one({"email": normalized_email, "id": {"$ne": client_id}})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        update_data['email'] = normalized_email
    if client_data.password is not None:
        valid_pw, pw_err = validate_password_strength(client_data.password)
        if not valid_pw:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=pw_err
            )
        update_data['password_hash'] = hash_password(client_data.password)
    if client_data.company is not None:
        update_data['company'] = client_data.company.strip()
    if client_data.phone is not None:
        update_data['phone'] = client_data.phone.strip()
    if client_data.is_active is not None:
        update_data['is_active'] = client_data.is_active
    
    update_data['updated_at'] = datetime.utcnow().isoformat()
    
    await clients_collection.update_one(
        {"id": client_id},
        {"$set": update_data}
    )
    
    # Fetch updated client
    updated_client = await clients_collection.find_one({"id": client_id})
    
    return ClientResponse(
        id=updated_client['id'],
        name=updated_client['name'],
        email=updated_client['email'],
        company=updated_client.get('company'),
        phone=updated_client.get('phone'),
        is_active=updated_client.get('is_active', True),
        created_at=updated_client['created_at'] if isinstance(updated_client['created_at'], str) else updated_client['created_at'].isoformat()
    )

@router.delete("/{client_id}")
async def delete_client(client_id: str, admin = Depends(require_permission("canManageClients"))):
    """Delete a client (Admin only)"""
    result = await clients_collection.delete_one({"id": client_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    return {"message": "Client deleted successfully"}
