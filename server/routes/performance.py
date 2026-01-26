from fastapi import APIRouter, Depends, HTTPException
from schemas.performance import (
    SubmitMCQScoreRequest,
    SubmitMCQScoreResponse
)
from services.performance_service.performance_service import submit_mcq_score
from middleware.auth_middleware import get_current_user
from db.config import db

router = APIRouter(
    prefix="/api/performance",
    tags=["Performance"]
)

performance_collection = db.performance


@router.post("/submit-mcq", response_model=SubmitMCQScoreResponse)
async def submit_mcq_score_api(
    payload: SubmitMCQScoreRequest,
    user=Depends(get_current_user)
):
    try:
        result = await submit_mcq_score(
            user_id=user["id"],
            payload=payload
        )

        return {
            "message": "MCQ score saved successfully",
            "total_score": result["total_score"],
            "performance_level": result["performance_level"],
            "day":result["day"]
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ---------------------------
# Get performance for a PDF
# ---------------------------
@router.get("/get")
async def get_performance(pdf_hash: str, user=Depends(get_current_user)):
    perf = await performance_collection.find_one({"user_id": user["id"], "pdf_hash": pdf_hash})
    if not perf:
        return {"day_wise_scores": []}
    return {"day_wise_scores": perf.get("day_wise_scores", [])}