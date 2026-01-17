from fastapi import APIRouter, HTTPException, status
from schemas.contact import ContactCreate, ContactResponse
from services.contact_service import create_contact

router = APIRouter(prefix="/api/contact", tags=["Contact"])

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact(contact: ContactCreate):
    if not contact.name or not contact.email or not contact.message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All fields are required"
        )
    try:
        saved_contact = await create_contact(contact)
        return saved_contact
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server Error"
        )
