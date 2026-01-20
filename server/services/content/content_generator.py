from typing import Dict, Any
import requests
import tempfile
import os
from services.content.image_generator import generate_image_from_content


from langchain_community.document_loaders import PyPDFLoader

from core.llm import get_llm
from db.config import db
from services.content.image_generator import generate_image_from_content
from prompts.content.content import content_prompt

from langchain_community.document_loaders import PyPDFLoader

from core.llm import get_llm
from db.config import db
from services.content.image_generator import generate_image_from_content
from prompts.content.content import content_prompt

from langchain_community.document_loaders import PyPDFLoader

from core.llm import get_llm
from services.content.content_fetcher import fetch_subtopic_pdf_content
from services.content.image_generator import generate_image_from_content
from db.config import db
from prompts.content.content import content_prompt


async def generate_topic_content(
    book_id: str,
    day_number: int,
    topic_index: int,
    subtopic_index: int
) -> Dict[str, Any]:

    # -------------------------------------------------
    # 1️⃣ CHECK CACHE FIRST (🔥 THIS WAS MISSING)
    # -------------------------------------------------
    schedule_doc = await db.schedules.find_one({"pdf_hash": book_id})
    day = schedule_doc["schedule"][day_number - 1]
    topic = day["topics"][topic_index]
    subtopic = topic["subtopics"][subtopic_index]

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
            "cached": True,   # ✅ NOW WORKS
        }

    # -------------------------------------------------
    # 2️⃣ FETCH RAW PDF CONTENT
    # -------------------------------------------------
    pdf_data = await fetch_subtopic_pdf_content(
        book_id=book_id,
        day_number=day_number,
        topic_index=topic_index,
        subtopic_index=subtopic_index,
    )

    raw_content = pdf_data["raw_content"]
    if not raw_content.strip():
        raise ValueError("No content extracted from PDF")

    # -------------------------------------------------
    # 3️⃣ RUN LLM
    # -------------------------------------------------
    prompt = content_prompt(raw_content)
    llm = get_llm(temperature=0.4)
    response = llm.invoke(prompt)
    final_content = response.text.strip()

    # -------------------------------------------------
    # 4️⃣ GENERATE IMAGES
    # -------------------------------------------------
    images = await generate_image_from_content(
        pdf_hash=book_id,
        content=final_content
    )

    # -------------------------------------------------
    # 5️⃣ SAVE TO DB
    # -------------------------------------------------
    await db.contents.update_one(
        {
            "pdf_hash": book_id,
            "day_number": day_number,
            "topic": pdf_data["chapter"],
            "subtopic": pdf_data["topic"],
        },
        {
            "$set": {
                "content": final_content,
                "page_range": pdf_data["page_range"],
            }
        },
        upsert=True
    )

    # -------------------------------------------------
    # 6️⃣ RETURN RESPONSE
    # -------------------------------------------------
    return {
        "chapter": pdf_data["chapter"],
        "topic": pdf_data["topic"],
        "content": final_content,
        "page_range": pdf_data["page_range"],
        "images": images,
        "cached": False,
    }


 
