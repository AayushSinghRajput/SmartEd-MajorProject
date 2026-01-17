from fastapi import APIRouter, HTTPException
from models.short_notes import ShortNotesRequest, ShortNotesResponse
from services.notes_summary.notes_summarizer import generate_day_notes


router = APIRouter(prefix="/api/notes", tags=["short_notes"])


@router.post("/summarize", response_model=ShortNotesResponse)
async def summarize_day_notes(payload: ShortNotesRequest):
    try:
        result = await generate_day_notes(
            book_id=payload.book_id,
            day_number=payload.day_number,
            note_type=payload.note_type
        )

        return ShortNotesResponse(
            status="success",
            book_id=payload.book_id,
            day_number=payload.day_number,
            note_type=payload.note_type,
            notes=result["notes"],
            cached=result["cached"],
            # day_content=result["day_content"]

        )

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
