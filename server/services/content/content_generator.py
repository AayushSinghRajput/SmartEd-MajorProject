from typing import Dict, Any
from core.llm import get_llm
from db.config import db
from services.content.image_generator import generate_image_from_content
from services.content.content_fetcher import fetch_subtopic_pdf_content
from prompts.content.content import content_prompt
from services.content.pdf_page_loader import load_pdf_pages_content


async def generate_topic_content(
    book_id: str,
    day_number: int,
    topic_index: int,
    subtopic_index: int
) -> Dict[str, Any]:

    # -------------------------------------------------
    # 1️⃣ LOAD SCHEDULE + FALLBACK FLAG
    # -------------------------------------------------
    schedule_doc = await db.schedules.find_one({"pdf_hash": book_id})
    if not schedule_doc:
        raise ValueError("Schedule not found")

    is_fallback = schedule_doc.get("is_fallback", False)

    day = schedule_doc["schedule"][day_number - 1]
    topic = day["topics"][topic_index]
    subtopic = topic["subtopics"][subtopic_index]

    # -------------------------------------------------
    # 2️⃣ CHECK CONTENT CACHE (COMMON FOR BOTH)
    # -------------------------------------------------
    cached_content = await db.contents.find_one({
        "pdf_hash": book_id,
        "day_number": day_number,
        "topic": topic["topic"],
        "subtopic": subtopic["title"],
    })

    if cached_content:
        images = await generate_image_from_content(
            pdf_hash=book_id,
            content=cached_content["content"]
        )

        return {
            "chapter": topic["topic"],
            "topic": subtopic["title"],
            "content": cached_content["content"],
            "page_range": cached_content.get("page_range", ""),
            "images": images,
            "cached": True,
        }

    # -------------------------------------------------
    # 3️⃣ FETCH RAW PDF CONTENT (BRANCH HERE)
    # -------------------------------------------------
    if is_fallback:
        # 🔥 FALLBACK MODE → page-based extraction
        print("⚠️ Using FALLBACK mode for content extraction.")
        start_page = subtopic["start_page"]
        end_page = subtopic["end_page"]

        raw_content, page_range = await load_pdf_pages_content(
            pdf_hash=book_id,
            start_page=start_page,
            end_page=end_page,
        )
        

        # page_range = f"{start_page}-{end_page}"
        chapter_title = topic["topic"]
        subtopic_title = subtopic["title"]

    else:
        # 🔥 NORMAL MODE → existing logic
        print("✅ Using NORMAL mode for content extraction.")
        pdf_data = await fetch_subtopic_pdf_content(
            book_id=book_id,
            day_number=day_number,
            topic_index=topic_index,
            subtopic_index=subtopic_index,
        )

        raw_content = pdf_data["raw_content"]
        page_range = pdf_data["page_range"]
        chapter_title = pdf_data["chapter"]
        subtopic_title = pdf_data["topic"]

    # raw_content = pdf_data["raw_content"]
    if not raw_content.strip():
        raise ValueError("No content extracted from PDF")

    # -------------------------------------------------
    # 4️⃣ RUN LLM (COMMON)
    # -------------------------------------------------
    prompt = content_prompt(raw_content)
    llm = get_llm(temperature=0.4)
    response = llm.invoke(prompt)
    final_content = response.text.strip()

    # -------------------------------------------------
    # 5️⃣ GENERATE IMAGES (COMMON)
    # -------------------------------------------------
    images = await generate_image_from_content(
        pdf_hash=book_id,
        content=final_content
    )

    # -------------------------------------------------
    # 6️⃣ SAVE TO DB (COMMON)
    # -------------------------------------------------
    await db.contents.update_one(
        {
            "pdf_hash": book_id,
            "day_number": day_number,
            "topic": chapter_title,
            "subtopic": subtopic_title,
        },
        {
            "$set": {
                "content": final_content,
                "page_range": page_range,
            }
        },
        upsert=True
    )

    # -------------------------------------------------
    # 7️⃣ RETURN RESPONSE (UNCHANGED)
    # -------------------------------------------------
    return {
        "chapter": chapter_title,
        "topic": subtopic_title,
        "content": final_content,
        "page_range": page_range,
        "images": images,
        "cached": False,
    }
