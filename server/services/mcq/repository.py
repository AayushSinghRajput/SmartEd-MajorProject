from datetime import datetime
from db.config import db


async def get_mcqs(
    pdf_hash: str,
    day_number: int
):
    return await db.mcqs.find_one({
        "pdf_hash": pdf_hash,
        "day_number": day_number
    })


async def save_mcqs(
    pdf_hash: str,
    day_number: int,
    mcqs: list
):
    await db.mcqs.update_one(
        {
            "pdf_hash": pdf_hash,
            "day_number": day_number
        },
        {
            "$set": {
                "mcqs": mcqs,
                "updated_at": datetime.utcnow()
            },
            "$setOnInsert": {
                "created_at": datetime.utcnow()
            }
        },
        upsert=True
    )
