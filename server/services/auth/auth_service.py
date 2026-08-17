from fastapi import HTTPException, status, Response
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from utils.hashing import hash_password, verify_password
from utils.jwt_token import create_access_token
from db.config import db
from core.config import settings

# MongoDB users collection
users_collection = db["users"]

# Cookie name for JWT
COOKIE_NAME = "access_token"


# ---------------------------
# Helper: Set JWT in HttpOnly cookie
# ---------------------------
def _set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,           # JS cannot access this cookie
        secure=False,            # True in production (HTTPS only)
        samesite="lax",          # Prevent CSRF in most cases
        max_age=60 * 60 * 24 * 7 # 7 days
    )


# ---------------------------
# Helper: Serialize user (exclude password)
# ---------------------------
def _serialize_user(user: dict):
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"]
    }


# ---------------------------
# Register a new user
# ---------------------------
async def register_user(response: Response, username: str, email: str, password: str):
    # Check if user already exists
    if await users_collection.find_one({"email": email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password and insert user
    hashed_password = hash_password(password)
    user_doc = {"username": username, "email": email, "password": hashed_password}
    result = await users_collection.insert_one(user_doc)

    # Create JWT and set cookie
    token = create_access_token({"user_id": str(result.inserted_id)})
    _set_auth_cookie(response, token)

    user = {"_id": result.inserted_id, "username": username, "email": email}

    return {
        "success": True,
        "statusCode": 201,
        "message": "User registered successfully",
        "user": _serialize_user(user)  # No token in response, cookie used instead
    }


# ---------------------------
# Login user
# ---------------------------
async def login_user(response: Response, email: str, password: str):
    user = await users_collection.find_one({"email": email})

    # Check credentials (Google-only accounts have no password hash)
    if not user or not user.get("password") or not verify_password(password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password"
        )

    # Create JWT and set cookie
    token = create_access_token({"user_id": str(user["_id"])})
    _set_auth_cookie(response, token)

    return {
        "success": True,
        "statusCode": 200,
        "message": "Login successful",
        "user": _serialize_user(user)
    }


# ---------------------------
# Login/register via "Continue with Google"
# ---------------------------
async def google_login_user(response: Response, credential: str):
    try:
        payload = google_id_token.verify_oauth2_token(
            credential, google_requests.Request(), settings.GOOGLE_OAUTH_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )

    email = payload["email"]
    user = await users_collection.find_one({"email": email})

    if not user:
        username = payload.get("name") or email.split("@")[0]
        user_doc = {
            "username": username,
            "email": email,
            "auth_provider": "google",
            "google_id": payload["sub"],
        }
        result = await users_collection.insert_one(user_doc)
        user = {**user_doc, "_id": result.inserted_id}

    # Create JWT and set cookie
    token = create_access_token({"user_id": str(user["_id"])})
    _set_auth_cookie(response, token)

    return {
        "success": True,
        "statusCode": 200,
        "message": "Login successful",
        "user": _serialize_user(user)
    }


# ---------------------------
# Logout user (delete cookie)
# ---------------------------
def logout_user(response: Response):
    response.delete_cookie(COOKIE_NAME)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Logout successful"
    }
