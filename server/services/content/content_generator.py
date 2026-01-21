from typing import Dict, Any
from core.llm import get_llm
from db.config import db
from services.content.image_generator import generate_image_from_content,generate_image_from_topic
from services.content.content_fetcher import fetch_subtopic_pdf_content
from prompts.content.content import content_prompt
from services.content.pdf_page_loader import load_pdf_pages_content
from services.rag.retriever import get_relevant_docs

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

        if not raw_content.strip():
            print("⚠️ No content extracted in FALLBACK mode from specified pages. if in future this happen then just incomment below code ... ")
            # raw_content = """ Content not available.
            #                   please message the student to move to next subtopic.
            #                   Note : Do not write anything more than this.
            #              """

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


    if not raw_content.strip():
        print("✅ Used RAG to supplement content extraction.")
        rag_query = f"{chapter_title} - {subtopic_title}"
        docs = get_relevant_docs(book_id, rag_query)
        # docs = get_relevant_docs(book_id, subtopic["title"])
        raw_content = "\n".join([doc.page_content for doc in docs])
            ## ----- DEBUGGING -----
        # print(f" subtopic title: {sub topic['title']}")
        # print(f"raw_content after RAG: {raw_content[:500]}...")
 

    if not raw_content.strip():
        print("⚠️ No content extracted from PDF.")
        # raise ValueError("No content extracted from PDF")
        raw_content = """ Content not available.
                         please message the student to move to next subtopic.
                         Note : Do not write anything more than this.
                      """

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
    if is_fallback:
        print("⚠️ FALLBACK mode - Using key word extraction method....")
        images = await generate_image_from_content(
        pdf_hash=book_id,
        content=final_content
    )
    
    else:
        print("🚀 NORMAL mode - Using topic + subtopic for images")
        images = await generate_image_from_topic(
            pdf_hash=book_id,
            topic=chapter_title,
            subtopic=subtopic_title
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
