from pydantic import BaseModel, Field
from typing import List, Dict
from enum import Enum


class MockType(str, Enum):
    Engineering = "Engineering"
    Medical = "Medical"


class Question(BaseModel):
    question_id: str
    subject: str
    topic: str
    question_text: str
    options: List[str]
    correct_option: str
    marks: int


class Mock(BaseModel):
    mock_type: MockType
    mock_id: str
    mock_title: str
    total_marks: int
    total_questions: int
    subjects: List[str]
    questions_per_subject: Dict[str, int]
    questions: List[Question]

    class Config:
        schema_extra = {
            "example": {
                "mock_type": "Engineering",
                "mock_id": "ENG-MOCK-01",
                "mock_title": "Engineering Full Mock Test",
                "total_marks": 100,
                "total_questions": 100,
                "subjects": ["Physics", "Chemistry", "Mathematics"],
                "questions_per_subject": {
                    "Physics": 33,
                    "Chemistry": 33,
                    "Mathematics": 34
                },
                "questions": []
            }
        }
