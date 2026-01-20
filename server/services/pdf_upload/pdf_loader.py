from typing import Dict, Any
import tempfile
import os

from langchain_community.document_loaders import PyPDFLoader

from core.llm import get_llm
from schemas.Pdf import TableOfContents
from prompts.pdf_upload.toc import build_toc_extraction_prompt
# from prompts.pdf_upload.toc import toc_prompt

# -------------------------
# LLM setup
# -------------------------
llm = get_llm(provider='gemini',temperature=0.5)
structured_llm = llm.with_structured_output(TableOfContents)


# -------------------------
# TOC Extraction Service
# -------------------------
def extract_toc(file_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts TOC from PDF and saves as JSON.
    output_path MUST be provided (hash-based).
    Returns: path to saved JSON file.
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
            # for doc in docs[: max(1, len(docs) // 10)]
            for doc in docs[:  len(docs) // 12]
        )
      
        # 3️⃣ Build prompt (delegated)
        # prompt = toc_prompt
        prompt = build_toc_extraction_prompt(toc_text)

        # 4️⃣ Invoke structured LLM
        toc_result: TableOfContents = structured_llm.invoke(prompt)

        return toc_result.model_dump()

    except Exception:
        # 5️⃣ Graceful fallback (important for robustness)
        return {
        "table_of_contents": [
            {
                "unit": None,
                "title": "Unstructured Content",
                "sections": [
                    {
                        "title": "Manual Review Required",
                        "page": 0
                    }
                ]
            }
        ]
    }


    finally:
        os.remove(tmp_path)
