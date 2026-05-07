from schemas.contact import ContactCreate
from db.config import db  
from datetime import datetime
from bson import ObjectId

async def create_contact(contact_data: ContactCreate):
    contact_doc = {
        "name": contact_data.name,
        "email": contact_data.email,
        "message": contact_data.message,
        "created_at": datetime.utcnow()
    }
    result = await db.contacts.insert_one(contact_doc)
    contact_doc["_id"] = str(result.inserted_id)
    return contact_doc
