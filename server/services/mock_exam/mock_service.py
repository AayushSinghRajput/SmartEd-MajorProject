from db.config import db
from schemas.Mock import Mock
from typing import List, Dict, Any
from bson import ObjectId

mock_collection = db["mocks"]


# ---------- Helper ----------
def serialize_mock(mock: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert MongoDB document to JSON-serializable dict
    """
    mock["_id"] = str(mock["_id"])
    return mock


# ---------- Create Mock ----------
async def create_mock_test(mock_data: Mock):
    mock_dict = mock_data.dict()

    result = await mock_collection.insert_one(mock_dict)

    # Attach serialized _id
    mock_dict["_id"] = str(result.inserted_id)

    return {
        "success": True,
        "statusCode": 201,
        "message": "Mock saved successfully",
        "data": mock_dict
    }


# ---------- Get Mock by Type ----------
async def get_mock_test(mock_type: str):
    mocks = await mock_collection.find(
        {"mock_type": mock_type}
    ).to_list(length=None)

    if not mocks:
        return {
            "success": True,
            "statusCode": 200,
            "message": "No mock exams found",
            "data": []
        }

    serialized_mocks = [serialize_mock(mock) for mock in mocks]

    return {
        "success": True,
        "statusCode": 200,
        "message": "Mock Exam fetched successfully",
        "data": serialized_mocks
    }
