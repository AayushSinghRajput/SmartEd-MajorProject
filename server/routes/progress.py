from fastapi import APIRouter, HTTPException, Depends
from middleware.auth_middleware import get_current_user
from schemas.progress import ProgressUpdateRequest, ProgressUpdateResponse
from services.progress_service.progress_service import update_user_progress

router = APIRouter(prefix="/api/progress", tags=["progress"])

@router.post("/update", response_model=ProgressUpdateResponse)
async def update_progress(
    payload: ProgressUpdateRequest,
    user=Depends(get_current_user)
):
    """
    Endpoint to update user's progress for a PDF.
    Progress is calculated as: completed_days / total_days * 100
    """
    try:
        study_progress = await update_user_progress(
            user_id=user["id"],
            pdf_hash=payload.pdf_hash,
            total_days=payload.total_days,
        )
        return {"study_progress": study_progress}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
