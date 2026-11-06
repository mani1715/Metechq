from fastapi import APIRouter, HTTPException, status, Depends
from schemas.client import ClientLogin, ClientTokenResponse, ClientResponse
from database import clients_collection
from auth.password import verify_password
from auth.jwt import create_access_token
from auth.client_auth import get_current_client
from datetime import datetime

router = APIRouter(tags=["client-auth"])

@router.post("/client/auth/login", response_model=ClientTokenResponse)
@router.post("/client/login", response_model=ClientTokenResponse)
async def client_login(credentials: ClientLogin):
    """Client login endpoint"""
    # Find client by email
    client_doc = await clients_collection.find_one({"email": credentials.email})
    
    if not client_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if client is active
    if not client_doc.get("is_active", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact support."
        )
    
    # Verify password
    if not verify_password(credentials.password, client_doc['password_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token with client type
    access_token = create_access_token(
        data={
            "sub": client_doc['email'],
            "id": client_doc['id'],
            "type": "client"  # Important: Mark this as a client token
        }
    )
    
    return ClientTokenResponse(
        access_token=access_token,
        client=ClientResponse(
            id=client_doc['id'],
            name=client_doc['name'],
            email=client_doc['email'],
            company=client_doc.get('company'),
            phone=client_doc.get('phone'),
            is_active=client_doc['is_active'],
            created_at=client_doc['created_at'] if isinstance(client_doc['created_at'], str) else client_doc['created_at'].isoformat()
        )
    )

@router.get("/client/auth/me", response_model=ClientResponse)
@router.get("/client/me", response_model=ClientResponse)
async def get_client_profile(client = Depends(get_current_client)):
    """Get current client profile"""
    client_doc = await clients_collection.find_one({"id": client["id"]})
    
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
        is_active=client_doc['is_active'],
        created_at=client_doc['created_at'] if isinstance(client_doc['created_at'], str) else client_doc['created_at'].isoformat()
    )

@router.post("/client/auth/logout")
@router.post("/client/logout")
async def client_logout():
    """Client logout endpoint (token invalidation handled on client side)"""
    return {"message": "Logged out successfully"}
