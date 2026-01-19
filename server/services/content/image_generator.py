from fastapi import HTTPException
from typing import List, Dict

from services.mcq.keyword_extractor import extract_keywords
from utils.image_search import fetch_search_image
from db.config import study_images_collection


async def generate_image_from_content(
    pdf_hash: str,
    content: str,
    num_keywords: int = 5,
    num_images: int = 3
) -> List[Dict[str, str]]:
    """
    Generate (or fetch cached) study images from content.

    Returns a list of images:
    [
        { url, photographerName, photographerUrl }
    ]
    """

    # 1️⃣ Validate input
    if not content or not content.strip():
        raise HTTPException(
            status_code=400,
            detail="Empty content provided for image generation"
        )

    # 2️⃣ Extract keywords (ONCE)
    keywords = extract_keywords(
        text=content,
        num_keywords=num_keywords
    )

    if not keywords:
        raise HTTPException(
            status_code=400,
            detail="Failed to extract keywords from content"
        )

    # 3️⃣ Check cache (soft match using top keywords)
    cached_images = await study_images_collection.find({
        "pdf_hash": pdf_hash,
        "keywords": {"$all": keywords[:2]}
    }).to_list(length=num_images)

    if cached_images:
        return [
            {
                "url": img["url"],
                "photographerName": img["photographerName"],
                "photographerUrl": img["photographerUrl"],
            }
            for img in cached_images
        ]

    # 4️⃣ Generate images using search API
    images = await fetch_search_image(
        keywords=keywords,
        num_images=num_images
    )

    # 5️⃣ Store images in DB
    image_docs = []

    for img in images:
        doc = {
            "pdf_hash": pdf_hash,
            "keywords": keywords,
            "url": img["url"],
            "photographerName": img["photographerName"],
            "photographerUrl": img["photographerUrl"],
        }

        await study_images_collection.insert_one(doc)
        image_docs.append(doc)

    return image_docs
