import os
import httpx
import urllib.parse
from typing import List, Dict
from core.config import settings


async def fetch_search_image(
    keywords: List[str],
    num_images: int = 3
) -> List[Dict[str, str]]:
    """
    Fetch HD study images suitable for full-screen display using Google Custom Search API.
    Adds 'diagram' to keywords for relevance and requests extra-large high-quality images.
    """

    API_KEY = settings.GOOGLE_SEARCH_API_KEY
    CX = settings.GOOGLE_SEARCH_ENGINE_ID

    search_query = f"{' '.join(keywords)} diagram"

    url = "https://www.googleapis.com/customsearch/v1"

    params = {
        "key": API_KEY,
        "cx": CX,
        "q": search_query,
        "searchType": "image",
        "num": num_images,
        "safe": "active",
        "imgSize": "xlarge",       # ✅ Extra-large images for HD
        "imgType": "photo",         # ✅ Ensures high-quality photos
        "imgColorType": "color",    # ✅ Only color images
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()

        data = response.json()
        items = data.get("items", [])

        images = []
        for item in items[:num_images]:
            images.append({
                "url": item.get("link"),                     # Full image URL
                "photographerName": item.get("displayLink"), # Source site
                "photographerUrl": item.get("image", {}).get("contextLink"), # Context
            })

        if images:
            return images

        # Fallback: high-res placeholder for full-screen
        return [{
            "url": (
                "https://placehold.co/1920x1080/4f46e5/ffffff"
                f"?text={urllib.parse.quote(keywords[0])}"
            ),
            "photographerName": "System Generated",
            "photographerUrl": "#",
        }]

    except Exception as e:
        print("Google Search Error:", str(e))
        # Fallback for error: high-res placeholder
        return [{
            "url": "https://placehold.co/1920x1080/eeeeee/999999?text=Image+Not+Found",
            "photographerName": "N/A",
            "photographerUrl": "#",
        }]
