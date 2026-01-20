from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from schemas.User import PyObjectId

# ---------------------------
# Comment Schemas
# ---------------------------
class CommentCreate(BaseModel):
    text: str = Field(..., example="Use factorial shortcut for identical items")

class CommentOut(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user: dict  # {"id": str, "username": str, "email": str}
    text: str
    created_at: datetime

    model_config = {
        "populate_by_name": True,
        "json_encoders": {ObjectId: str}
    }

# ---------------------------
# Post Schemas
# ---------------------------
class PostCreate(BaseModel):
    content: str = Field(..., example="How to solve permutation questions faster?")
    # images will be handled as UploadFile in route

class PostOut(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    author: dict  # {"id": str, "username": str, "email": str}
    content: str
    images: List[str] = []  # Cloudinary URLs
    created_at: datetime
    likes_count: int
    comments_count: int
    is_liked_by_me: bool = False

    model_config = {
        "populate_by_name": True,
        "json_encoders": {ObjectId: str}
    }
