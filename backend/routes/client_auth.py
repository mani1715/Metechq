from fastapi import APIRouter, HTTPException, status, Depends, Request
from schemas.client import ClientLogin, ClientTokenResponse, ClientResponse
from database import clients_collection
from auth.password import verify_password
from auth.jwt import create_access_token
from auth.client_auth import get_current_client
from utils.rate_limiter import login_rate_limiter
from datetime import datetime

router = APIRouter(tags=["client-auth"])

@router.post("/client/auth/login", response_model=ClientTokenResponse)
@router.post("/client/login", response_model=ClientTokenResponse)
async def client_login(credentials: ClientLogin, request: Request):
    """Client login endpoint with brute-force rate limiting"""
    client_ip = request.client.host if request.client else "unknown"
    normalized_email = credentials.email.strip().lower()
    rate_key = f"client_login:{client_ip}:{normalized_email}"

    # Atomic check-and-record brute force limit: 5 attempts per 5 minutes
    allowed, retry_after = login_rate_limiter.check_and_record(rate_key, max_attempts=5, window_seconds=300)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many failed login attempts. Please try again in {retry_after} seconds."
        )

    # Find client by email (case-insensitive)
    client_doc = await clients_collection.find_one({"email": {"$regex": f"^{normalized_email}$", "$options": "i"}})
    
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
    
    # Reset attempts on success
    login_rate_limiter.reset(rate_key)

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
    """Client logout endpoint"""
    return {"message": "Logged out successfully"}
