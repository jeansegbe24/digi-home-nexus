import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional, Union
from app.core.config import settings

def hash_password(password: str) -> str:
    # Hash password using bcrypt
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Verify a plain text password against its bcrypt hash
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(subject: Union[str, int], role: str, expires_delta: Optional[timedelta] = None) -> str:
    # Create a short-lived access token
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "sub": str(subject),
        "role": role,
        "type": "access",
        "exp": expire
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(subject: Union[str, int], expires_delta: Optional[timedelta] = None) -> str:
    # Create a long-lived refresh token
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        
    to_encode = {
        "sub": str(subject),
        "type": "refresh",
        "exp": expire
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str, expected_type: str = "access") -> Optional[dict]:
    # Decode and verify token. Checks signature, expiration and type claims.
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") == expected_type:
            return payload
    except jwt.ExpiredSignatureError:
        print(f"Token signature expired for type {expected_type}")
    except jwt.InvalidTokenError as e:
        print(f"Invalid token for type {expected_type}: {e}")
    return None
