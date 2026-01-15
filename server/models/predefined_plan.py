from typing import List, Optional
from pydantic import BaseModel, Field, validator
from datetime import datetime
from bson import ObjectId

# Subschemas
class SubtopicSchema(BaseModel):
    """MongoDB subtopic schema"""
    title: str
    description: str

class TopicSchema(BaseModel):
    """MongoDB topic schema"""
    title: str
    subtopics: List[SubtopicSchema] = []

class DaySchema(BaseModel):
    """MongoDB day schema"""
    day: int
    topics: List[TopicSchema] = []

# Main MongoDB Schema
class PredefinedPlanSchema(BaseModel):
    """MongoDB main schema - equivalent to Mongoose model"""
    id: Optional[str] = Field(None, alias="_id")
    subject: str = Field(..., min_length=1, trim_whitespace=True)
    totalDays: int = 0
    schedule: List[DaySchema] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "subject": "Physics",
                "totalDays": 30,
                "schedule": [
                    {
                        "day": 1,
                        "topics": [
                            {
                                "title": "Mechanics",
                                "subtopics": [
                                    {"title": "Kinematics", "description": "Motion basics"}
                                ]
                            }
                        ]
                    }
                ]
            }
        }

# Request/Response Schemas
class CreatePlanRequest(BaseModel):
    """Request schema for creating a plan"""
    subject: str = Field(..., min_length=1)
    schedule: Optional[List[DaySchema]] = []

    @validator("subject")
    def clean_subject(cls, v):
        """Clean and validate subject name"""
        return v.strip()

    class Config:
        schema_extra = {
            "example": {
                "subject": "Mathematics",
                "schedule": [
                    {
                        "day": 1,
                        "topics": [
                            {
                                "title": "Algebra",
                                "subtopics": [
                                    {"title": "Linear Equations", "description": "Solving equations"}
                                ]
                            }
                        ]
                    }
                ]
            }
        }

class CreatePlanResponse(BaseModel):
    """Response schema for plan creation"""
    message: str
    totalDaysSaved: int

    class Config:
        schema_extra = {
            "example": {
                "message": "Plan saved successfully!",
                "totalDaysSaved": 30
            }
        }

class GetPlanResponse(BaseModel):
    """Response schema for getting a plan"""
    subject: str
    totalDays: int
    schedule: List[DaySchema]

class UpdatePlanRequest(BaseModel):
    """Request schema for updating a plan"""
    schedule: Optional[List[DaySchema]] = None