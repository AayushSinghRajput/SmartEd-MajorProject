from datetime import datetime
from db.config import db

study_progress = db.study_progress

async def update_user_progress(user_id: str, pdf_hash: str, total_days: int) -> float:
    """
    Increments completed_days for a user & pdf,
    stores progress in study_progress collection.
    """

    progress_doc = await db.study_progress.find_one({
        "user_id": user_id,
        "pdf_hash": pdf_hash
    })

    if progress_doc:
        completed_days = min(
            progress_doc.get("completed_days", 0) + 1,
            total_days
        )
    else:
        completed_days = 1

    study_progress = round((completed_days / total_days) * 100, 2)

    await db.study_progress.update_one(
        {
            "user_id": user_id,
            "pdf_hash": pdf_hash
        },
        {
            "$set": {
                "completed_days": completed_days,
                "total_days": total_days,
                "study_progress": study_progress,
                "updated_at": datetime.utcnow()
            }
        },
        upsert=True  # 🔥 key line
    )

    return study_progress
