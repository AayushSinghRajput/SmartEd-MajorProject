from schemas.Pdf import TableOfContents


def build_toc_extraction_prompt(toc_text: str) -> str:
    """
    Builds a strict prompt for extracting Table of Contents from PDF text.
    PURE function: no side effects.
    """

    return f"""
You are extracting a Table of Contents from a textbook.

Rules:
- Respond ONLY in valid JSON
- Match the EXACT schema
- Do NOT add explanations
- Do NOT hallucinate missing sections

Schema:
{TableOfContents.model_json_schema()}

Document:
{toc_text}
"""
