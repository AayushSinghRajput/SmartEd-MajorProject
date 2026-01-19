import cloudinary
import cloudinary.uploader
import io
from core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

async def upload_pdf_to_cloudinary_bytes(pdf_bytes: bytes) -> str:
    """
    Upload PDF bytes to Cloudinary as a raw file.
    Returns secure URL.
    """
    file_like = io.BytesIO(pdf_bytes)

    result = cloudinary.uploader.upload(
        file_like,
        resource_type="raw",
        folder="pdfs"
    )

    return result["secure_url"]


async def upload_image_to_cloudinary_bytes(image_bytes: bytes) -> str:
    result = cloudinary.uploader.upload(
        image_bytes,
        resource_type="image",
        folder="study_books"
    )
    return result["secure_url"]


async def upload_post_image_to_cloudinary_bytes(image_bytes: bytes) -> str:
    result = cloudinary.uploader.upload(
        image_bytes,
        resource_type="image",
        folder="community_post"
    )
    return result["secure_url"]