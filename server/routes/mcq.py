from fastapi import APIRouter, HTTPException
from schemas.Mcq import MCQRequest, MCQResponse
from services.mcq.mcq_question import mcq_generator
from services.mcq.content_fetcher_mcq import fetch_day_content
from services.mcq.repository import get_mcqs, save_mcqs

router = APIRouter(
    prefix="/api/mcq",
    tags=["MCQ"]
)

MCQ_COUNT = 10


@router.post("/generate", response_model=MCQResponse)
async def generate_mcqs(payload: MCQRequest):
    try:
        # 1️⃣ Check cache first
        cached = await get_mcqs(
            pdf_hash=payload.pdf_hash,
            day_number=payload.day_number
        )

        if cached:
            return {"mcqs": cached["mcqs"]}

        # 2️⃣ Fetch full-day study content
        context = await fetch_day_content(
            book_id=payload.pdf_hash,
            day_number=payload.day_number
        )

        if not context.strip():
            raise HTTPException(
                status_code=404,
                detail="No content found for this day"
            )

        # 3️⃣ Generate MCQs
        mcqs = mcq_generator(
            context=context,
            num_questions=MCQ_COUNT
        )

        # 4️⃣ Store in DB
        await save_mcqs(
            pdf_hash=payload.pdf_hash,
            day_number=payload.day_number,
            mcqs=mcqs
        )

        return {"mcqs": mcqs}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
