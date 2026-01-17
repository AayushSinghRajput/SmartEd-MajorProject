from pydantic import BaseModel

class ProgressUpdateRequest(BaseModel):
    pdf_hash: str         # Unique identifier of the PDF
    total_days: int       # Total days in the schedule

class ProgressUpdateResponse(BaseModel):
    study_progress: float       # Study Progress percentage (0-100)
