from typing import Dict, Any
import tempfile
import os

from langchain_community.document_loaders import PyPDFLoader

from core.llm import get_llm
from schemas.Pdf import TableOfContents
from prompts.pdf_upload.toc import build_toc_extraction_prompt


# -------------------------
# LLM setup
# -------------------------
llm = get_llm(temperature=0.5)
structured_llm = llm.with_structured_output(TableOfContents)


# -------------------------
# TOC Extraction Service
# -------------------------
def extract_toc(file_bytes: bytes) -> Dict[str, Any]:
    """
    Extract Table of Contents from a PDF file.
    """

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        # 1️⃣ Load PDF
        loader = PyPDFLoader(tmp_path)
        docs = loader.load()

        # 2️⃣ Take first ~8% pages for TOC signal
        toc_text = " ".join(
            doc.page_content
            for doc in docs[: max(1, len(docs) // 12)]
        )

        # 3️⃣ Build prompt (delegated)
        prompt = build_toc_extraction_prompt(toc_text)

        # 4️⃣ Invoke structured LLM
        toc_result: TableOfContents = structured_llm.invoke(prompt)

        return toc_result.model_dump()

    except Exception:
        # 5️⃣ Graceful fallback (important for robustness)
        return {
            "toc": [
                {
                    "title": "Unstructured Content",
                    "sections": [
                        {
                            "title": "Manual Review Required",
                            "page": None
                        }
                    ],
                }
            ]
        }

    finally:
        os.remove(tmp_path)
