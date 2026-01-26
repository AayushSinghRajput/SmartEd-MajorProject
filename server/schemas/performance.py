from pydantic import BaseModel, Field
from typing import List
from datetime import datetime


class DayPerformance(BaseModel):
    day: int
    score: int
    total_questions: int
    percentage:float
    performance_level:str  # bad | medium | good
    submitted_at: datetime = Field(default_factory=datetime.utcnow)


class Performance(BaseModel):
    user_id: str
    pdf_hash: str   # ✅ changed from book_id
    total_score: int = 0
    day_wise_scores: List[DayPerformance] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


class SubmitMCQScoreRequest(BaseModel):
    pdf_hash: str   # ✅ changed from book_id
    day: int
    score: int
    total_questions: int


class SubmitMCQScoreResponse(BaseModel):
    message: str
    total_score: int
    performance_level: str
    day: int
