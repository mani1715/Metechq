from fastapi import APIRouter, HTTPException, status, Depends
from schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from database import users_collection
from auth import hash_password, verify_password, create_access_token
from auth.admin_auth import require_super_admin
from auth.password import validate_password_strength
from utils import serialize_document
from models import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    current_admin: dict = Depends(require_super_admin)
):
    """Register a new user (super admin only)"""
    # Validate password strength
    valid_pw, pw_err = validate_password_strength(user_data.password)
    if not valid_pw:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=pw_err
        )
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email.lower(),
        password_hash=hash_password(user_data.password),
        role=user_data.role
    )
    
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await users_collection.insert_one(user_dict)
    
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login and receive JWT token"""
    # Find user
    user_doc = await users_collection.find_one({"email": credentials.email.lower()})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user_doc['password_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_doc['email'], "id": user_doc['id'], "role": user_doc['role']}
    )
    
    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_doc['id'],
            name=user_doc['name'],
            email=user_doc['email'],
            role=user_doc['role']
        )
    )

@router.post("/logout")
async def logout():
    """Logout endpoint"""
    return {"message": "Logged out successfully"}
