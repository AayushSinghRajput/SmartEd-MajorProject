import fitz
from io import BytesIO
from pdf2image import convert_from_bytes
import pytesseract
from core.config import settings


POPPLER_PATH = settings.POPPLER_PATH
TESSERACT_PATH = settings.TESSERACT_PATH
pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH


def is_scanned_pdf(pdf_bytes: bytes) -> bool:
    """
    Returns True if PDF has no meaningful text layer.
    """
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text_len = sum(len(page.get_text("text").strip()) for page in doc)
        doc.close()
        return text_len < 50
    except Exception:
        return True


def make_searchable_pdf(pdf_bytes: bytes) -> bytes:
    """
    Convert scanned PDF → searchable PDF (text layer added).
    """
    images = convert_from_bytes(
        pdf_bytes,
        dpi=300,
        poppler_path=POPPLER_PATH,
    )

    final_pdf = fitz.open()

    for image in images:
        ocr_pdf_bytes = pytesseract.image_to_pdf_or_hocr(
            image,
            lang="eng",
            extension="pdf",
        )
        ocr_doc = fitz.open(stream=ocr_pdf_bytes, filetype="pdf")
        final_pdf.insert_pdf(ocr_doc)
        ocr_doc.close()

    output = BytesIO()
    final_pdf.save(output)
    final_pdf.close()

    output.seek(0)
    return output.read()
