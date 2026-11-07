from fastapi import HTTPException, Header, status
from typing import Optional
from .jwt import decode_access_token
from database import admins_collection

async def get_current_admin(authorization: Optional[str] = Header(None)):
    """Get current authenticated admin from JWT token"""
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
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    # Get admin from database
    admin = await admins_collection.find_one({"id": payload.get("id")})
    if not admin or admin.get("is_active") is False:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found"
        )
    
    # Determine role - handle both old and new admin formats
    role = admin.get("role")
    if not role:
        # Fallback to is_super_admin field
        role = "super_admin" if admin.get("is_super_admin", False) else "admin"
    
    return {
        "id": admin["id"],
        "username": admin.get("username", admin.get("email", "")),
        "email": admin.get("email", ""),
        "role": role,
        "permissions": admin.get("permissions", {})
    }

async def require_super_admin(authorization: Optional[str] = Header(None)):
    """Require super admin role"""
    admin = await get_current_admin(authorization)
    if admin["role"] != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    return admin

def check_permission(admin: dict, permission: str) -> bool:
    """Check if admin has specific permission"""
    if admin["role"] == "super_admin":
        return True
    
    permissions = admin.get("permissions", {})
    return permissions.get(permission, False)


def require_permission(permission: str):
    """Enforce configured admin permissions on the server, not only in menus."""
    async def guard(authorization: Optional[str] = Header(None)):
        admin = await get_current_admin(authorization)
        if not check_permission(admin, permission):
            raise HTTPException(status_code=403, detail="You do not have permission for this operation")
        return admin
    return guard
