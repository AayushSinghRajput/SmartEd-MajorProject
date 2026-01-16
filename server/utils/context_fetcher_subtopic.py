from db.config import db


async def fetch_subtopic_content(
    pdf_hash: str,
    day_index: int,
    topic_index: int,
    subtopic_index: int
) -> dict:
    """
    Index-based context fetcher:
    - Uses schedules to resolve names
    - Uses contents to fetch actual text
    """

    # 1️⃣ Get schedule for PDF
    schedule_doc = await db.schedules.find_one(
        {"pdf_hash": pdf_hash},
        {"_id": 0, "schedule": 1}
    )

    if not schedule_doc:
        raise ValueError("Schedule not found for PDF")

    schedule = schedule_doc["schedule"]

    # 2️⃣ Resolve day (1-based index)
    try:
        day_obj = schedule[day_index - 1]
    except IndexError:
        raise ValueError("Invalid day index")

    day_number = day_obj["day"]

    # 3️⃣ Resolve topic
    try:
        topic_obj = day_obj["topics"][topic_index ]
    except IndexError:
        raise ValueError("Invalid topic index")

    topic_name = topic_obj["topic"]

    # 4️⃣ Resolve subtopic
    try:
        subtopic_obj = topic_obj["subtopics"][subtopic_index ]
    except IndexError:
        raise ValueError("Invalid subtopic index")

    subtopic_name = subtopic_obj["title"]

    # 5️⃣ Fetch actual content
    content_doc = await db.contents.find_one({
        "pdf_hash": pdf_hash,
        "day_number": day_number,
        "topic": topic_name,
        "subtopic": subtopic_name
    })

    if not content_doc:
        return {
            "day": day_number,
            "topic": topic_name,
            "subtopic": subtopic_name,
            "content": ""
        }

    return {
        "day": day_number,
        "topic": topic_name,
        "subtopic": subtopic_name,
        "content": content_doc["content"]
    }
