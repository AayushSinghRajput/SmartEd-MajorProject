from collections import defaultdict
from typing import Dict, List
from db.config import db


# ---------------------------
# Fetch full raw content for a day 
# ---------------------------
async def fetch_day_content(
    book_id: str,
    day_number: int
) -> str:
    """
    Returns FULL raw study content for a given day by:
    - Fetching all subtopics from MongoDB
    - Grouping by topic
    - Combining everything into a single text block

    """

    # 1️⃣ Fetch all subtopic content for the day
    cursor = db.contents.find(
        {
            "pdf_hash": book_id,
            "day_number": day_number
        }
    ).sort([("topic", 1), ("subtopic", 1)])

    topic_map: Dict[str, List[str]] = defaultdict(list)

    async for doc in cursor:
        topic_map[doc["topic"]].append(
            f"{doc['subtopic']}:\n{doc['content']}"
        )

    if not topic_map:
        raise ValueError("No content found for this day")

    # 2️⃣ Combine all topics + subtopics into raw text
    final_content = []

    for topic, subtopics in topic_map.items():
        combined_subtopics = "\n\n".join(subtopics)
        final_content.append(
            f"{topic}\n{combined_subtopics}"
        )

    # 3️⃣ Return full raw content
    return "\n\n".join(final_content)


# ---------------------------
# Manual test runner
# ---------------------------
if __name__ == "__main__":
    import asyncio

    async def main():
        content = await fetch_day_content(
            "b151dc02424b241b86bf2abfa6551cc4",
            1
        )
        print(content)

    asyncio.run(main())

    # Run with:
    # python -m services.content_fetcher
