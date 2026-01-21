import tempfile
import os
from typing import Tuple
from langchain_community.document_loaders import PyPDFLoader
from db.config import db


async def load_pdf_pages_content(
    pdf_hash: str,
    start_page: int,
    end_page: int
) -> Tuple[str, str]:
    """
    Load raw text content directly from PDF pages.
    Pages are 1-indexed.
    """

    pdf_doc = await db.pdfs.find_one({"pdf_hash": pdf_hash})
    if not pdf_doc:
        raise ValueError("PDF not found")

    pdf_url = pdf_doc["pdf_url"]

    # download PDF
    import requests
    response = requests.get(pdf_url)
    response.raise_for_status()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(response.content)
        tmp_path = tmp.name

    try:
        loader = PyPDFLoader(tmp_path)
        docs = loader.load()

        start_idx = max(start_page - 1, 0)
        end_idx = min(end_page, len(docs))

        raw_text = "\n".join(
            docs[i].page_content for i in range(start_idx, end_idx)
        )

        page_range = f"{start_page}-{end_page}"
        ### ----- to check which content is loaded ----- ###
        # print(f"Extracted pages {page_range} from PDF.")
        # print(f"Raw content from fallback mode: {raw_text[:]}")
        
        return raw_text, page_range

    finally:
        os.remove(tmp_path)
