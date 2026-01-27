from pydantic import BaseModel
from datetime import datetime
from typing import List


class EntranceNewsItem(BaseModel):
    exam: str
    title: str
    link: str
    source: str
    published_at: datetime


class EntranceNewsResponse(BaseModel):
    exam: str
    news: List[EntranceNewsItem]
