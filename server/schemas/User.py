from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Any
from bson import ObjectId
from pydantic_core import core_schema


# ---------------------------
# Custom ObjectId for Pydantic v2
# ---------------------------
class PyObjectId(ObjectId):
    """
    Custom ObjectId type compatible with Pydantic v2
    """

    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        source_type: Any,
        handler: Any
    ) -> core_schema.CoreSchema:
        # Validate ObjectId as string input
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, v: Any) -> ObjectId:
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(
        cls,
        core_schema: core_schema.CoreSchema,
        handler: Any
    ):
        # Show ObjectId as string in OpenAPI
        return {"type": "string"}


# ---------------------------
# User Schema
# ---------------------------
class User(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    username: str
    email: EmailStr
    password: str

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }
