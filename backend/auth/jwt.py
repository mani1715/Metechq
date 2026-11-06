from datetime import datetime, timedelta
from typing import Optional, Dict
import jwt
import os
from config import get_jwt_secret, get_client_jwt_secret

ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token with appropriate realm secret"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    # Dual-realm key selection: clients use client secret; admins use admin secret
    if to_encode.get("type") == "client":
        secret = get_client_jwt_secret()
    else:
        secret = get_jwt_secret()
        
    encoded_jwt = jwt.encode(to_encode, secret, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str, is_client: bool = False) -> Optional[Dict]:
    """Decode and verify a JWT token from admin or client realm"""
    try:
        secrets_to_try = [get_client_jwt_secret(), get_jwt_secret()] if is_client else [get_jwt_secret(), get_client_jwt_secret()]
        for secret in secrets_to_try:
            try:
                payload = jwt.decode(token, secret, algorithms=[ALGORITHM])
                return payload
            except jwt.InvalidSignatureError:
                continue
        return None
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    except Exception:
        return None
