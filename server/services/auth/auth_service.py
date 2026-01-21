from fastapi import HTTPException, status, Response
from utils.hashing import hash_password, verify_password
from utils.jwt_token import create_access_token
from db.config import db

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

    # Check credentials
    if not user or not verify_password(password, user["password"]):
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
# Logout user (delete cookie)
# ---------------------------
def logout_user(response: Response):
    response.delete_cookie(COOKIE_NAME)
    return {
        "success": True,
        "statusCode": 200,
        "message": "Logout successful"
    }
