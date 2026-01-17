from pydantic import BaseModel, Field
from typing import List


class MCQRequest(BaseModel):
    pdf_hash: str = Field(..., min_length=1)
    day_number: int = Field(..., ge=1)


class MCQItem(BaseModel):
    question: str
    options: List[str]
    answer_index: int


class MCQResponse(BaseModel):
    mcqs: List[MCQItem]