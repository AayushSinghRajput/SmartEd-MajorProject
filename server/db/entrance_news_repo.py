from db.config import entrance_news_collection
from datetime import datetime

# -------------------------
# Save news for a specific exam (IOE or IOM)
# -------------------------
async def save_news(exam: str, news: list):
    """
    Replace old news for the exam with new news.
    Ensures all required fields exist, adds 'exam' field,
    and sets 'source' to exam name if missing.
    """
    # Remove old news
    await entrance_news_collection.delete_many({"exam": exam})

    if news:
        news_to_insert = []
        for item in news:
            # Handle missing or invalid published_at
            published_at = item.get("published_at")
            if not published_at:
                published_at = datetime.utcnow()
            elif isinstance(published_at, str):
                try:
                    published_at = datetime.fromisoformat(published_at)
                except ValueError:
                    published_at = datetime.utcnow()

            # Default source based on exam if missing
            source = item.get("source")
            if not source:
                source = "IOE" if exam.upper() == "IOE" else "IOM"

            # Prepare news item for insertion
            news_to_insert.append({
                "exam": exam,
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "source": source,
                "published_at": published_at,
            })

        await entrance_news_collection.insert_many(news_to_insert)


# -------------------------
# Fetch news for a specific exam
# -------------------------
async def get_news(exam: str):
    """
    Fetch latest 20 news items for the exam.
    Converts MongoDB ObjectId to string and datetime to ISO string.
    """
    cursor = entrance_news_collection.find({"exam": exam}).sort("_id", -1)
    news_list = await cursor.to_list(length=20)

    for item in news_list:
        item["_id"] = str(item["_id"])
        if isinstance(item["published_at"], datetime):
            item["published_at"] = item["published_at"].isoformat()
    
    return news_list
