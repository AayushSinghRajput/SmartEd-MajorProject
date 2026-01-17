from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactResponse(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    email: EmailStr
    message: str
    created_at: Optional[datetime]

    class Config:
        allow_population_by_field_name = True
