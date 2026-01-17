from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    user_id: str = Field(..., min_length=1)
    pdf_hash: str = Field(..., min_length=1)
    day: int = Field(..., ge=1)
    topic: int = Field(..., ge=0)
    subtopic: int = Field(..., ge=0)
    message: str = Field(..., min_length=1)




# Chat history API


# WebSocket chat