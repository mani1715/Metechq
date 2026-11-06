from fastapi import HTTPException, Header, status
from typing import Optional
from .jwt import decode_access_token
from database import clients_collection

async def get_current_client(authorization: Optional[str] = Header(None)):
    """Get current authenticated client from JWT token"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    # Extract token from "Bearer <token>" format
    try:
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme"
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    
    # Decode token
    payload = decode_access_token(token, is_client=True)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    # Check if token is for a client (not admin)
    if payload.get("type") != "client":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token type"
        )
    
    # Get client from database
    client = await clients_collection.find_one({"id": payload.get("id")})
    if not client:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Client not found"
        )
    
    # Check if client is active
    if not client.get("is_active", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Client account is deactivated"
        )
    
    return {
        "id": client["id"],
        "name": client["name"],
        "email": client["email"],
        "company": client.get("company"),
        "phone": client.get("phone")
    }
