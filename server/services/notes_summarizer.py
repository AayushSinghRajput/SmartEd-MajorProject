from services.content_fetcher import fetch_day_content
from core.llm import get_llm
from datetime import datetime
from db.config import db



def build_notes_prompt(day_number: int, content: str, note_type: str) -> str:
    format_instruction = {
        "short": """
Write concise short notes:
- 1–2 paragraphs
- Simple language
- Cover only key ideas
""",
        "bullet": """
Write bullet-point notes:
- Use bullet points only
- Each point max 1 line
- Cover all major concepts
""",
        "flash": """
Create flash notes:
- Question–Answer format
- Each question tests one concept
- Short, factual answers
"""
    }

    return f"""
You are a teacher summarizing study material.

Day: {day_number}

Study Content:
{content}

Task:
{format_instruction[note_type]}

Rules:
- Do NOT add new information
- Do NOT repeat content verbatim
- Keep output short and exam-focused
- Use markdown formatting only
"""




async def generate_day_notes(
    book_id: str,
    day_number: int,
    note_type: str
):
    # 1️⃣ Check cache first
    cached_note = await db.day_notes.find_one({
        "pdf_hash": book_id,
        "day_number": day_number,
        "note_type": note_type
    })

    if cached_note:
        # day_content = await fetch_day_content(book_id, day_number)
        return {
            "notes": cached_note["notes"],
            "cached": True,
            # "day_content": day_content

        }

    # 2️⃣ Fetch day content
    day_content = await fetch_day_content(book_id, day_number)

    # 3️⃣ Build prompt
    prompt = build_notes_prompt(
        day_number=day_number,
        content=day_content,
        note_type=note_type
    )

    # 4️⃣ Generate notes
    llm = get_llm(temperature=0.3)
    response = llm.invoke(prompt)
    notes = response.text.strip()

    # 5️⃣ Store in MongoDB
    await db.day_notes.update_one(
        {
            "pdf_hash": book_id,
            "day_number": day_number,
            "note_type": note_type
        },
        {
            "$set": {
                "notes": notes,
                "updated_at": datetime.utcnow()
            },
            "$setOnInsert": {
                "created_at": datetime.utcnow()
            }
        },
        upsert=True
    )

    return {
        "notes": notes,
        "cached": False,
        # "day_content": day_content
    }


