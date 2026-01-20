import logging
from typing import Dict, Any, List
import requests
import tempfile
import os
import re

import fitz  # PyMuPDF
from db.config import db

logger = logging.getLogger(__name__)

# -------------------------------------------------
# PDF cache (pdf_url -> pages with blocks)
# -------------------------------------------------
_pdf_cache: Dict[str, List[Dict[str, Any]]] = {}


# -------------------------------------------------
# Load PDF and extract BLOCKS (layout-aware)
# -------------------------------------------------
def load_pdf_pages_from_url(pdf_url: str):
    if pdf_url in _pdf_cache:
        return _pdf_cache[pdf_url]

    response = requests.get(pdf_url)
    response.raise_for_status()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(response.content)
        tmp_path = tmp.name

    pages = []
    doc = None

    try:
        doc = fitz.open(tmp_path)

        for page_index, page in enumerate(doc):
            pages.append({
                "page_index": page_index,
                "blocks": page.get_text("dict")["blocks"],
            })

        _pdf_cache[pdf_url] = pages
        return pages

    finally:
        if doc is not None:
            doc.close()        # ✅ RELEASE FILE HANDLE
        try:
            os.remove(tmp_path)
        except PermissionError:
            # Windows fallback (rare but safe)
            pass



# -------------------------------------------------
# Helpers
# -------------------------------------------------
def extract_block_text(block) -> str:
    text = ""
    for line in block.get("lines", []):
        for span in line.get("spans", []):
            text += span["text"] + " "
    return text.strip()


def max_font_size(block) -> float:
    sizes = []
    for line in block.get("lines", []):
        for span in line.get("spans", []):
            sizes.append(span["size"])
    return max(sizes) if sizes else 0


def is_toc_like(text: str) -> bool:
    if re.search(r"\.{3,}\s*\d+$", text):
        return True
    digit_ratio = sum(c.isdigit() for c in text) / max(len(text), 1)
    return digit_ratio > 0.25


def is_real_heading(block, title: str, min_font: float = 11.5) -> bool:
    if block.get("type") != 0:
        return False

    text = extract_block_text(block)
    if not text:
        return False

    if title.lower() not in text.lower():
        return False

    if is_toc_like(text):
        return False

    if max_font_size(block) < min_font:
        return False

    return True


# -------------------------------------------------
# CORE: Extract subtopic content using blocks
# -------------------------------------------------
def extract_subtopic_content_blocks(
    pages: List[Dict[str, Any]],
    title: str,
    next_title: str | None,
    min_page_index: int = 4,
    max_pages: int = 10
):
    collecting = False
    content_parts: List[str] = []
    start_page = None
    end_page = None

    for page in pages:
        page_index = page["page_index"]

        if page_index < min_page_index:
            continue

        if start_page is not None and page_index > start_page + max_pages:
            break

        for block in page["blocks"]:
            if block.get("type") != 0:
                continue

            text = extract_block_text(block)

            # START
            if not collecting:
                if is_real_heading(block, title):
                    collecting = True
                    start_page = page_index
                continue

            # STOP
            if next_title and next_title.lower() in text.lower():
                if is_real_heading(block, next_title):
                    end_page = page_index
                    return start_page, end_page, "\n".join(content_parts)

            # BODY
            if len(text) > 40 and not is_toc_like(text):
                content_parts.append(text)
                end_page = page_index

    if start_page is None:
        return 0, 0, ""

    if end_page is None:
        end_page = start_page

    return start_page, end_page, "\n".join(content_parts)


# -------------------------------------------------
# PUBLIC API — PDF CONTENT ONLY
# -------------------------------------------------
async def fetch_subtopic_pdf_content(
    book_id: str,
    day_number: int,
    topic_index: int,
    subtopic_index: int
) -> Dict[str, Any]:
    """
    Fetch RAW PDF content for a subtopic.
    No LLM. No images. No DB writes.
    """

    pdf_doc = await db.pdfs.find_one({"pdf_hash": book_id})
    if not pdf_doc:
        raise ValueError("PDF not found")

    schedule_doc = await db.schedules.find_one({"pdf_hash": book_id})
    if not schedule_doc:
        raise ValueError("Schedule not found")

    schedule = schedule_doc["schedule"]

    try:
        day = schedule[day_number - 1]
        topic = day["topics"][topic_index]
        chapter = topic["topic"]
        subtopics = topic["subtopics"]
        subtopic = subtopics[subtopic_index]
    except IndexError:
        raise ValueError("Invalid indices")

    title = subtopic["title"]
    next_title = (
        subtopics[subtopic_index + 1]["title"]
        if subtopic_index + 1 < len(subtopics)
        else None
    )

    pages = load_pdf_pages_from_url(pdf_doc["pdf_url"])

    start_page, end_page, raw_text = extract_subtopic_content_blocks(
        pages=pages,
        title=title,
        next_title=next_title,
    )

    page_range = (
        str(start_page + 1)
        if start_page == end_page
        else f"{start_page + 1}-{end_page + 1}"
    )

    return {
        "chapter": chapter,
        "topic": title,
        "raw_content": raw_text,
        "start_page": start_page + 1,
        "end_page": end_page + 1,
        "page_range": page_range,
    }
