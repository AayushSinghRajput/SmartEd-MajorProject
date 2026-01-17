from fastapi import APIRouter, Depends, HTTPException
from schemas.performance import (
    SubmitMCQScoreRequest,
    SubmitMCQScoreResponse
)
from services.performance_service.performance_service import submit_mcq_score
from middleware.auth_middleware import get_current_user

router = APIRouter(
    prefix="/api/performance",
    tags=["Performance"]
)


@router.post(
    "/submit-mcq",
    response_model=SubmitMCQScoreResponse
)
async def submit_mcq_score_api(
    payload: SubmitMCQScoreRequest,
    user=Depends(get_current_user)
):
    try:
        total_score = await submit_mcq_score(
            user_id=user['id'],
            payload=payload
        )

        return {
            "message": "MCQ score saved successfully",
            "total_score": total_score
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
