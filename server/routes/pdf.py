from fastapi import APIRouter, UploadFile, File, Query, HTTPException, Depends, Response, Form
from bson import ObjectId
from utils.file_hash import compute_md5
from services.pdf_upload.study_scheduler import generate_study_schedule_from_toc
from services.pdf_upload.pdf_loader import extract_toc
from db.cloudinary import upload_pdf_to_cloudinary_bytes, upload_image_to_cloudinary_bytes
from db.config import db
from schemas.Content import UploadScheduleResponse
from middleware.auth_middleware import get_current_user
from services.pdf_upload.fallback_scheduler import generate_schedule_from_pages
from langchain_community.document_loaders import PyPDFLoader
import tempfile
import os


router = APIRouter(prefix="/api/study", tags=["Study Plan"])


# ===================== UPLOAD PDF AND GENERATE SCHEDULE =====================
@router.post(
    "/upload-and-schedule",
    response_model=UploadScheduleResponse,
    summary="Upload PDF and generate study schedule",
    description="Upload a PDF file and specify number of study days. Returns structured study schedule."
)
async def upload_pdf_and_generate_schedule(
    response: Response,
    file: UploadFile = File(..., description="PDF file to upload"),
    book_name: str = Form(..., description="Book name from frontend"),
    days: int = Query(..., gt=0, description="Number of study days"),
    current_user=Depends(get_current_user)
):
    """
    Protected route: only logged-in users can upload PDFs and generate study schedule.
    """
    try:
        pdf_bytes = await file.read()
        if not pdf_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        pdf_hash = compute_md5(pdf_bytes)

        pdf_doc = await db.pdfs.find_one({"pdf_hash": pdf_hash})

        if pdf_doc:
            toc_data = pdf_doc["toc"]
            pdf_url = pdf_doc["pdf_url"]
            book_name = pdf_doc.get("book_name", book_name)
            image_url = pdf_doc.get("image_url")
            pdf_cached = True
        else:
            pdf_url = await upload_pdf_to_cloudinary_bytes(pdf_bytes)
            toc_data = extract_toc(pdf_bytes)
            image_url = None
            await db.pdfs.insert_one({
                "pdf_hash": pdf_hash,
                "toc": toc_data,
                "pdf_url": pdf_url,
                "book_name": book_name,
                "image_url": image_url,
                "user_id": current_user["id"]
            })
            pdf_cached = False

        schedule_doc = await db.schedules.find_one({
            "pdf_hash": pdf_hash,
            "days": days
        })

# ----------------------------------universal fallback for schedule-------------------------------------------
        if schedule_doc:
            schedule = schedule_doc["schedule"]
            is_fallback = schedule_doc.get("is_fallback", False)
            schedule_cached = True
        else:
            is_fallback = False
            # 🔥 FIRST TRY TOC-BASED SCHEDULE
            try:
                if toc_data and "table_of_contents" in toc_data:
                    schedule = generate_study_schedule_from_toc(
                        toc_data=toc_data,
                        total_days=days
                    )
                else:
                    raise ValueError("Empty TOC")

            except Exception:
                # 🔥 PURE PYTHON FALLBACK (NO LLM)
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                    tmp.write(pdf_bytes)
                    tmp_path = tmp.name

                loader = PyPDFLoader(tmp_path)
                docs = loader.load()
                total_pages = len(docs)

                schedule = generate_schedule_from_pages(
                    total_pages=total_pages,
                    total_days=days
                )
                is_fallback = True
                os.remove(tmp_path)
                


            await db.schedules.update_one(
            {"pdf_hash": pdf_hash, "days": days},
            {
                "$set": {
                    "schedule": schedule,
                    "is_fallback": is_fallback
                }
            },
            upsert=True
        )


            schedule_cached = False
            
        
# ========================================================================================
        return UploadScheduleResponse(
            status="success",
            status_code=200,
            message="Study schedule generated successfully",
            pdf_hash=pdf_hash,
            book_name=book_name,
            days=days,
            schedule=schedule,
            cached=pdf_cached and schedule_cached,
            image_url=pdf_doc.get("image_url") if pdf_doc else None,
            is_fallback=is_fallback,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===================== UPDATE BOOK IMAGE =====================
@router.patch(
    "/update-image",
    summary="Upload or update book image"
)
async def update_book_image(
    pdf_hash: str = Query(...),
    image: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files allowed")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image file")

    image_url = await upload_image_to_cloudinary_bytes(image_bytes)

    result = await db.pdfs.update_one(
        {"pdf_hash": pdf_hash},
        {"$set": {"image_url": image_url}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="PDF not found")

    return {
        "status": "success",
        "image_url": image_url
    }


# ===================== GET ALL USER BOOKS WITH PROGRESS =====================
@router.get("/my-books", summary="Get all uploaded PDFs with progress")
async def get_user_books(current_user=Depends(get_current_user)):
    """
    Returns all uploaded PDFs for the logged-in user.

    Each book contains:
    - pdf_hash
    - name
    - image
    - pdf_url
    - study_progress (day completion based)
    - performance_progress (MCQ score based)
    """
    try:
        user_id = current_user["id"]

        # ---------------- FETCH USER PDFs ----------------
        pdfs = await db.pdfs.find({"user_id": user_id}).to_list(length=100)

        # ---------------- FETCH STUDY PROGRESS ----------------
        progress_docs = await db.study_progress.find(
            {"user_id": user_id}
        ).to_list(length=100)

        # Map: pdf_hash -> study_progress
        study_progress_map = {
            p["pdf_hash"]: p.get("study_progress", 0)
            for p in progress_docs
        }

        books = []

        for pdf_doc in pdfs:
            pdf_hash = pdf_doc["pdf_hash"]

            # ---------------- PERFORMANCE PROGRESS ----------------
            perf_doc = await db.performance.find_one({
                "user_id": user_id,
                "pdf_hash": pdf_hash
            })

            performance_progress = 0
            if perf_doc and perf_doc.get("day_wise_scores"):
                total_score = sum(
                    int(d.get("score", 0))
                    for d in perf_doc["day_wise_scores"]
                )
                total_questions = sum(
                    int(d.get("total_questions", 0))
                    for d in perf_doc["day_wise_scores"]
                )

                if total_questions > 0:
                    performance_progress = int(
                        (total_score / total_questions) * 100
                    )

            # ---------------- STUDY PROGRESS ----------------
            study_progress = study_progress_map.get(pdf_hash, 0)

            # ---------------- BUILD RESPONSE ----------------
            books.append({
                "id": pdf_hash,
                "pdf_hash": pdf_hash,
                "name": pdf_doc.get("book_name", "Untitled"),
                "image": pdf_doc.get("image_url") or "/images/dummy-book.png",
                "pdf_url": pdf_doc.get("pdf_url"),

                # 🔥 separated progress types
                "study_progress": study_progress,
                "performance_progress": performance_progress,
            })

        return {
            "status": "success",
            "books": books
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# ===================== NEW ROUTE: GET SCHEDULE FOR A BOOK =====================
@router.get("/book-schedule/{pdf_hash}", summary="Get study schedule for a specific book")
async def get_book_schedule(
    pdf_hash: str,
    days: int = Query(None, description="Number of study days, optional"),
    current_user=Depends(get_current_user)
):
    """
    Fetches schedule + book metadata for a specific book by its PDF hash.
    Only returns data if the book belongs to the logged-in user.
    """
    try:
        # 1️⃣ Verify PDF exists and belongs to the user
        pdf_doc = await db.pdfs.find_one({"pdf_hash": pdf_hash, "user_id": current_user["id"]})
        if not pdf_doc:
            raise HTTPException(status_code=404, detail="PDF not found")

        # 2️⃣ Fetch schedule from DB
        query = {"pdf_hash": pdf_hash}
        if days:
            query["days"] = days
        schedule_doc = await db.schedules.find_one(query)

        if not schedule_doc:
            # If schedule not found, generate for default days (e.g., 7)
            default_days = days or 7
            schedule = generate_study_schedule_from_toc(
                toc_data=pdf_doc["toc"],
                total_days=default_days
            )
            # Save schedule in DB
            await db.schedules.update_one(
                {"pdf_hash": pdf_hash, "days": default_days},
                {"$set": {"schedule": schedule}},
                upsert=True
            )
        else:
            schedule = schedule_doc["schedule"]

        return {
            "status": "success",
            "pdf_hash": pdf_hash,
            "book_name": pdf_doc.get("book_name", "Untitled"),
            "days": days or len(schedule),
            "schedule": schedule,
            "image": pdf_doc.get("image_url"),
            "pdf_url": pdf_doc.get("pdf_url"),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
