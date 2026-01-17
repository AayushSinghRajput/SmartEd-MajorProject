from fastapi import APIRouter, Depends
from services.mock_exam.mock_service import create_mock_test, get_mock_test
from models.Mock import Mock
from middleware.auth_middleware import get_current_user

router = APIRouter(
    prefix="/api/exams",
    tags=["Mock Exams"]
)


@router.post("/", status_code=201)
async def create_mock(
    mock_data: Mock,
    current_user=Depends(get_current_user)
): 
    _ = current_user  # tell linters it's intentionally unused
    return await create_mock_test(mock_data)



@router.get("/{mock_type}")
async def fetch_mock(
    mock_type: str,
    current_user=Depends(get_current_user)
):
    _ = current_user  
    return await get_mock_test(mock_type)

