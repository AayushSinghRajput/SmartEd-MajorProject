from pydantic import BaseModel,Field
from typing import Literal

class ShortNotesRequest(BaseModel):
    book_id: str
    day_number: int = Field(..., ge=1)
    note_type: Literal["short", "bullet", "flash"] = "short"

    
class ShortNotesResponse(BaseModel):
    status: str
    book_id: str
    day_number: int
    note_type: str
    notes: str
    cached: bool
    # day_content: str
