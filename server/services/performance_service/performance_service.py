from db.config import db
from datetime import datetime

performance_collection = db.performance


async def submit_mcq_score(user_id: str, payload):
    performance = await performance_collection.find_one({
        "user_id": user_id,
        "pdf_hash": payload.pdf_hash
    })

    # Prevent re-attempt for same day
    if performance:
        for d in performance["day_wise_scores"]:
            if d["day"] == payload.day:
                raise Exception("MCQs already attempted for this day")

        new_day = {
            "day": payload.day,
            "score": payload.score,
            "total_questions": payload.total_questions,
            "submitted_at": datetime.utcnow()
        }

        new_total = performance["total_score"] + payload.score

        await performance_collection.update_one(
            {"_id": performance["_id"]},
            {
                "$push": {"day_wise_scores": new_day},
                "$set": {"total_score": new_total}
            }
        )

        return new_total

    # First attempt for this PDF
    await performance_collection.insert_one({
        "user_id": user_id,
        "pdf_hash": payload.pdf_hash,
        "total_score": payload.score,
        "day_wise_scores": [{
            "day": payload.day,
            "score": payload.score,
            "total_questions": payload.total_questions,
            "submitted_at": datetime.utcnow()
        }],
        "created_at": datetime.utcnow()
    })

    return payload.score
