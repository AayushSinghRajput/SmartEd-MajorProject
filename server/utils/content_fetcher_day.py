
from collections import defaultdict
from typing import Dict, List
from db.config import db
from core.llm import get_llm


# ---------------------------
# Prompt builder for bullet extraction
# ---------------------------
def build_bullet_prompt(topic: str, content: str) -> str:
    return f"""
You are a teacher creating revision notes.

Topic: {topic}

Study Content:
{content}

Task:
- Extract ONLY important bullet points
- Each bullet should be short and factual
- Cover definitions, key ideas, and examples
- Do NOT add new information
- Do NOT repeat sentences verbatim

Output format:
- Bullet points only
- Use markdown
"""


# ---------------------------
# Extract bullet points for ONE topic using LLM
# ---------------------------
def extract_topic_bullets(topic: str, content: str) -> str:
    llm = get_llm(temperature=0.2)  # low temperature for factual extraction
    prompt = build_bullet_prompt(topic, content)
    response = llm.invoke(prompt)
    return response.text.strip()


# ---------------------------
# Fetch day content → topic-wise → extract bullets → return
# ---------------------------
async def fetch_day_content(
    book_id: str,
    day_number: int
) -> str:
    """
    Returns bullet-point notes for a full day by:
    - Fetching subtopic content from MongoDB
    - Grouping by topic
    - Extracting bullet points per topic using LLM
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

    # 2️⃣ Extract bullet points per topic
    final_notes = []

    for topic, subtopics in topic_map.items():
        combined_topic_content = "\n\n".join(subtopics)

        bullets = extract_topic_bullets(
            topic=topic,
            content=combined_topic_content
        )

        final_notes.append(
            f"## {topic}\n{bullets}"
        )

    # 3️⃣ Combine all topic bullet notes
    return "\n\n".join(final_notes)


# ---------------------------
# Manual test runner
# ---------------------------
if __name__ == "__main__":
    import asyncio

    async def main():
        notes = await fetch_day_content(
            "b151dc02424b241b86bf2abfa6551cc4",
            1
        )
        print(notes)

    asyncio.run(main())

    # to run :  python -m services.content_fetcher
