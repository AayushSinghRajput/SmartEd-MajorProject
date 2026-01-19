from db.config import db
from bson import ObjectId
from datetime import datetime

posts_col = db["community_posts"]
likes_col = db["community_likes"]
comments_col = db["community_comments"]


# ---------------------------
# Create post
# ---------------------------
async def create_post(user: dict, content: str, images: list[str]):
    post = {
        "author_id": user["id"],
        "author_username": user["username"],
        "author_email": user["email"],
        "content": content,
        "images": images,
        "created_at": datetime.utcnow(),
        "likes_count": 0,
        "comments_count": 0
    }
    res = await posts_col.insert_one(post)
    post["_id"] = res.inserted_id
    post["is_liked_by_me"] = False
    return _serialize_post(post)


# ---------------------------
# Get all posts with like status
# ---------------------------
async def get_posts_with_like_status(user_id: str):
    posts = [p async for p in posts_col.find().sort("created_at", -1)]

    liked_ids = {
        l["post_id"]
        async for l in likes_col.find({"user_id": user_id})
    }

    for p in posts:
        p["is_liked_by_me"] = str(p["_id"]) in liked_ids

    return [_serialize_post(p) for p in posts]


# ---------------------------
# Update post (owner only)
# ---------------------------
async def update_post(post_id: str, user_id: str, content: str, images: list[str]):
    post = await posts_col.find_one_and_update(
        {"_id": ObjectId(post_id), "author_id": user_id},
        {"$set": {"content": content, "images": images}},
        return_document=True
    )
    if not post:
        return None
    post["is_liked_by_me"] = False
    return _serialize_post(post)


# ---------------------------
# Delete post (cascade delete)
# ---------------------------
async def delete_post(post_id: str, user_id: str):
    post = await posts_col.find_one({"_id": ObjectId(post_id), "author_id": user_id})
    if not post:
        return False

    await posts_col.delete_one({"_id": ObjectId(post_id)})
    await likes_col.delete_many({"post_id": post_id})
    await comments_col.delete_many({"post_id": post_id})
    return True


# ---------------------------
# Like post
# ---------------------------
async def like_post(post_id: str, user_id: str):
     # Make sure post_id is ObjectId when storing in DB
    post_obj_id = ObjectId(post_id)
    if await likes_col.find_one({"post_id":  str(post_obj_id), "user_id": user_id}):
        return False

    await likes_col.insert_one({
        "post_id": str(post_obj_id),  # store as string
        "user_id": user_id,
        "created_at": datetime.utcnow()
    })

    await posts_col.update_one(
        {"_id": ObjectId(post_id)},
        {"$inc": {"likes_count": 1}}
    )
    return True


# ---------------------------
# Unlike post
# ---------------------------
async def unlike_post(post_id: str, user_id: str):
    post_obj_id = ObjectId(post_id)
    result = await likes_col.delete_one({"post_id": str(post_obj_id), "user_id": user_id})
    if not result.deleted_count:
        return False

    await posts_col.update_one(
        {"_id": post_obj_id},
        {"$inc": {"likes_count": -1}}
    )
    return True


# ---------------------------
# Add comment
# ---------------------------
async def add_comment(post_id: str, user: dict, text: str):
    comment = {
        "post_id": post_id,
        "user_id": user["id"],
        "user_username": user["username"],
        "user_email": user["email"],
        "text": text,
        "created_at": datetime.utcnow()
    }
    res = await comments_col.insert_one(comment)

    await posts_col.update_one(
        {"_id": ObjectId(post_id)},
        {"$inc": {"comments_count": 1}}
    )

    comment["_id"] = res.inserted_id
    return _serialize_comment(comment)


# ---------------------------
# Get comments
# ---------------------------
async def get_comments(post_id: str):
    comments = [
        _serialize_comment(c)
        async for c in comments_col.find({"post_id": post_id}).sort("created_at", 1)
    ]
    return comments


# ---------------------------
# Get user's posts with like status
# ---------------------------
async def get_user_posts_with_like_status(user_id: str):
    posts = [
        p async for p in posts_col.find({"author_id": user_id}).sort("created_at", -1)
    ]

    liked_ids = {
        l["post_id"]
        async for l in likes_col.find({"user_id": user_id})
    }

    for p in posts:
        p["is_liked_by_me"] = str(p["_id"]) in liked_ids

    return [_serialize_post(p) for p in posts]


# ---------------------------
# Helpers
# ---------------------------
def _serialize_post(p):
    return {
        "id": str(p["_id"]),
        "author": {
            "id": p["author_id"],
            "username": p["author_username"],
            "email": p["author_email"],
        },
        "content": p["content"],
        "images":p.get("images",[]),
        "created_at": p["created_at"],
        "likes_count": p["likes_count"],
        "comments_count": p["comments_count"],
        "is_liked_by_me": p.get("is_liked_by_me", False),
    }


def _serialize_comment(c):
    return {
        "id": str(c["_id"]),
        "user": {
            "id": c["user_id"],
            "username": c["user_username"],
            "email": c["user_email"],
        },
        "text": c["text"],
        "created_at": c["created_at"],
    }
