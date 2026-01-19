from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List
from schemas.community import PostCreate, PostOut, CommentCreate, CommentOut
from services.community_service.community_service import (
    create_post,
    get_posts_with_like_status,
    like_post,
    unlike_post,
    add_comment,
    get_comments,
    get_user_posts_with_like_status,
    update_post,
    delete_post,
)
from middleware.auth_middleware import get_current_user
from db.cloudinary import upload_post_image_to_cloudinary_bytes

router = APIRouter(prefix="/api/community", tags=["Community"])

# ---------------------------
# Create post with optional images
# ---------------------------
@router.post("/", response_model=PostOut)
async def create_community_post(
    content: str = Form(...),
    images: List[UploadFile] = File([]),  # accept multiple images
    user=Depends(get_current_user)
):
    image_urls = []
    for img in images:
        bytes_data = await img.read()
        url = await upload_post_image_to_cloudinary_bytes(bytes_data)
        image_urls.append(url)

    return await create_post(user, content, image_urls)

# ---------------------------
# Update post with optional new images
# ---------------------------
@router.put("/{post_id}", response_model=PostOut)
async def update_community_post(
    post_id: str,
    content: str = Form(...),
    images: List[UploadFile] = File([]),
    user=Depends(get_current_user)
):
    image_urls = []
    for img in images:
        bytes_data = await img.read()
        url = await upload_post_image_to_cloudinary_bytes(bytes_data)
        image_urls.append(url)

    post = await update_post(post_id, user["id"], content, image_urls)
    if not post:
        raise HTTPException(status_code=403, detail="Not authorized or post not found")
    return post

# ---------------------------
# The rest of the routes remain the same
# ---------------------------
@router.get("/", response_model=list[PostOut])
async def fetch_posts(user=Depends(get_current_user)):
    return await get_posts_with_like_status(user["id"])

@router.delete("/{post_id}")
async def delete_community_post(post_id: str, user=Depends(get_current_user)):
    if not await delete_post(post_id, user["id"]):
        raise HTTPException(status_code=403, detail="Not authorized or post not found")
    return {"message": "Post deleted"}

@router.post("/{post_id}/like")
async def like_community_post(post_id: str, user=Depends(get_current_user)):
    if not await like_post(post_id, user["id"]):
        raise HTTPException(status_code=400, detail="Already liked")
    return {"message": "Liked"}

@router.delete("/{post_id}/like")
async def unlike_community_post(post_id: str, user=Depends(get_current_user)):
    if not await unlike_post(post_id, user["id"]):
        raise HTTPException(status_code=400, detail="Not liked yet")
    return {"message": "Unliked"}

@router.post("/{post_id}/comment", response_model=CommentOut)
async def add_post_comment(post_id: str, payload: CommentCreate, user=Depends(get_current_user)):
    return await add_comment(post_id, user, payload.text)

@router.get("/{post_id}/comments", response_model=list[CommentOut])
async def fetch_comments(post_id: str):
    return await get_comments(post_id)

@router.get("/my/posts", response_model=list[PostOut])
async def my_posts(user=Depends(get_current_user)):
    return await get_user_posts_with_like_status(user["id"])
