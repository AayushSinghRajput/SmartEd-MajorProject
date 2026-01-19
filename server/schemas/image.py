from pydantic import BaseModel


class ImageResponse(BaseModel):
    url: str
    photographerName: str
    photographerUrl: str
