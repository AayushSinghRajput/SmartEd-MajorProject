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
    Fetch a relevant study image using Google Custom Search API.
    Uses only keywords + 'diagram' for relevance.
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
        "imgSize": "medium",
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
                "url": item.get("link"),
                "photographerName": item.get("displayLink"),
                "photographerUrl": item.get("image", {}).get("contextLink"),
            })

        if images:
            return images

        # Fallback if no image found
        return [{
            "url": (
                "https://placehold.co/600x400/4f46e5/ffffff"
                f"?text={urllib.parse.quote(keywords[0])}"
            ),
            "photographerName": "System Generated",
            "photographerUrl": "#",
        }]

    except Exception as e:
        print("Google Search Error:", str(e))
        return [{
            "url": "https://placehold.co/600x400/eeeeee/999999?text=Image+Not+Found",
            "photographerName": "N/A",
            "photographerUrl": "#",
        }]
