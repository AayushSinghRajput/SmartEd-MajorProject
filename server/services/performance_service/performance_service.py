from db.config import db
from datetime import datetime
from fastapi import HTTPException, status
from utils.performance_service import calculate_performance

performance_collection = db.performance


async def submit_mcq_score(user_id: str, payload):
    # Check if performance already exists for this PDF
    performance = await performance_collection.find_one({
        "user_id": user_id,
        "pdf_hash": payload.pdf_hash
    })

    # 📊 Calculate percentage & performance level
    percentage, level = calculate_performance(
        payload.score,
        payload.total_questions
    )

    # 📅 Day-wise performance object
    new_day = {
        "day": payload.day,
        "score": payload.score,
        "total_questions": payload.total_questions,
        "percentage": percentage,
        "performance_level": level,
        "submitted_at": datetime.utcnow()
    }

    # ❌ Prevent re-attempt for same day
    if performance:
        for d in performance["day_wise_scores"]:
            if d["day"] == payload.day:
                raise HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="MCQs already attempted for this day"
)

        # ➕ Update total score
        new_total = performance["total_score"] + payload.score

        # 📝 Update existing document
        await performance_collection.update_one(
            {"_id": performance["_id"]},
            {
                "$push": {"day_wise_scores": new_day},
                "$set": {"total_score": new_total}
            }
        )

        # ✅ Return everything frontend needs
        return {
            "total_score": new_total,
            "performance_level": level,
            "day": payload.day
        }

    # 🆕 First attempt for this PDF
    await performance_collection.insert_one({
        "user_id": user_id,
        "pdf_hash": payload.pdf_hash,
        "total_score": payload.score,
        "day_wise_scores": [new_day],
        "created_at": datetime.utcnow()
    })

    # ✅ Return response for frontend
    return {
        "total_score": payload.score,
        "performance_level": level,
        "day": payload.day
    }
