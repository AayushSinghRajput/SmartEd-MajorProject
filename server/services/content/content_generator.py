import logging
from typing import Dict, Any
import requests
import tempfile
import os

from langchain_community.document_loaders import PyPDFLoader

from core.llm import get_llm
from db.config import db
from services.content.image_generator import generate_image_from_content
from prompts.content.content import content_prompt

logger = logging.getLogger(__name__)

# Cache loaded PDFs in memory (pdf_url -> docs)
_pdf_cache: Dict[str, Any] = {}

# ---------------------------
# Load PDF from Cloudinary URL (PyPDFLoader-safe)
# ---------------------------
def load_pdf_docs_from_url(pdf_url: str):
    """
    Downloads PDF from Cloudinary, stores temporarily,
    loads via PyPDFLoader, caches result.
    """
    if pdf_url in _pdf_cache:
        return _pdf_cache[pdf_url]

    response = requests.get(pdf_url)
    response.raise_for_status()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(response.content)
        tmp_path = tmp.name

    try:
        loader = PyPDFLoader(tmp_path)
        docs = loader.load()
        _pdf_cache[pdf_url] = docs
        return docs
    finally:
        os.remove(tmp_path)


# ---------------------------
# Extract content for a topic
# ---------------------------
def get_topic_pages(docs, start_page: int, next_start_page: int | None = None):
    text = ""
    end_page = start_page

    # max_page = (
    #     next_start_page - 1
    #     if next_start_page is not None
    #     else len(docs) - 1
    # )
    max_page = (
    min(next_start_page - 1, len(docs) - 1)
    if next_start_page is not None
    else len(docs) - 1
  )


    for page in range(start_page, min(max_page + 1, len(docs))):
        text += docs[page].page_content + "\n"
        end_page = page

    return start_page, end_page, text


# ---------------------------
# Generate content with LLM
# ---------------------------
def generate_content_with_llm(
    chapter: str,
    topic: str,
    pdf_content: str
) -> str:
    prompt = content_prompt(pdf_content)

    llm = get_llm(temperature=0.5)
    response = llm.invoke(prompt)

    return response.text.strip()


# ---------------------------
# Generate topic content & update schedule
# ---------------------------
async def generate_topic_content(
    book_id: str,
    day_number: int,
    topic_index: int,
    subtopic_index: int
) -> Dict[str, Any]:

    # 1️⃣ Load PDF metadata
    pdf_doc = await db.pdfs.find_one({"pdf_hash": book_id})
    if not pdf_doc:
        raise ValueError("PDF not found")

    pdf_url = pdf_doc["pdf_url"]

    # 2️⃣ Load schedule
    schedule_doc = await db.schedules.find_one({"pdf_hash": book_id})
    if not schedule_doc:
        raise ValueError("Schedule not found")

    schedule = schedule_doc["schedule"]

    # 3️⃣ Resolve indices safely
    try:
        day_data = schedule[day_number - 1]
        topic_data = day_data["topics"][topic_index]
        chapter = topic_data["topic"]
        subtopic = topic_data["subtopics"][subtopic_index]
    except IndexError:
        raise ValueError("Invalid day / topic / subtopic index")

    subtopic_title = subtopic["title"]
    # start_page = subtopic["page"]
    start_page = max(0, (subtopic["page"] or 1) - 1)

    # 4️⃣ If content already exists → return cached content + images
    if subtopic.get("content"):
        images = await generate_image_from_content(
            pdf_hash=book_id,
            content=subtopic["content"]
        )

        return {
            "chapter": chapter,
            "topic": subtopic_title,
            "content": subtopic["content"],
            "page_range": subtopic.get("page_range", ""),
            "images": images,
            "cached": True,
        }

    # 5️⃣ Load PDF pages
    docs = load_pdf_docs_from_url(pdf_url)

    # Detect next subtopic page (for page range)
    next_start_page = None
    if subtopic_index + 1 < len(topic_data["subtopics"]):
        # next_start_page = topic_data["subtopics"][subtopic_index + 1]["page"]
        next_page_raw = topic_data["subtopics"][subtopic_index + 1]["page"]
        next_start_page = (
            max(0, next_page_raw - 1)
            if next_page_raw is not None
            else None
        )


    _, end_page, pdf_content = get_topic_pages(
        docs,
        start_page=start_page,
        next_start_page=next_start_page
    )

    # 6️⃣ Generate content using LLM
    content = generate_content_with_llm(
        chapter,
        subtopic_title,
        pdf_content
    )

    # ✅ Improved page_range formatting
    # page_range = (
    #     str(start_page)
    #     if start_page == end_page
    #     else f"{start_page}-{end_page}"
    # )

    # Convert back to 1-based for UI
    page_range = (
        str(start_page + 1)
        if start_page == end_page
        else f"{start_page + 1}-{end_page + 1}"
    )


    # 7️⃣ Update schedule.subtopics[].content IN-PLACE
    update_path = (
        f"schedule.{day_number - 1}.topics.{topic_index}."
        f"subtopics.{subtopic_index}"
    )

    await db.schedules.update_one(
        {"pdf_hash": book_id},
        {
            "$set": {
                f"{update_path}.content": content,
                f"{update_path}.page_range": page_range
            }
        }
    )

    # 8️⃣ Save to contents collection (for search / MCQ / chatbot)
    await db.contents.update_one(
        {
            "pdf_hash": book_id,
            "day_number": day_number,
            "topic": chapter,
            "subtopic": subtopic_title,
        },
        {
            "$set": {
                "content": content,
                "page_range": page_range,
            }
        },
        upsert=True
    )

    # 9️⃣ Generate images from content
    images = await generate_image_from_content(
        pdf_hash=book_id,
        content=content
    )

    return {
        "chapter": chapter,
        "topic": subtopic_title,
        "content": content,
        "page_range": page_range,
        "images": images,
        "cached": False,
    }
