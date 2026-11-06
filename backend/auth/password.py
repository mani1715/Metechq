import bcrypt
from typing import Tuple

MIN_PASSWORD_LENGTH = 8

def validate_password_strength(password: str) -> Tuple[bool, str]:
    """Validates that a password satisfies minimum security requirements"""
    if not password:
        return False, "Password cannot be empty"
    if len(password) < MIN_PASSWORD_LENGTH:
        return False, f"Password must be at least {MIN_PASSWORD_LENGTH} characters long"
    if password.strip() != password:
        return False, "Password cannot contain leading or trailing whitespace"
    return True, ""

def hash_password(password: str) -> str:
    """Hash a password using bcrypt with standard cost factor"""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Safely verify a password against its bcrypt hash"""
    if not plain_password or not hashed_password:
        return False
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except (ValueError, TypeError, Exception):
        return False
