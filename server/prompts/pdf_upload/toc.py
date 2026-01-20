from schemas.Pdf import TableOfContents



def build_toc_extraction_prompt(document_content: str):
    return [
        (
            "system",
            """You are an expert at extracting a structured table of contents from documents.

IMPORTANT RULES:
1. Extract ALL content including front matter (preface, list of figures, acknowledgments, etc.)
2. For front matter (non-numbered sections), set "unit" to null
3. For numbered units or chapters, use the actual unit number
4. Include all sections with their correct page numbers
5. Be thorough — do not skip any sections
6. Maintain the document's original order

Example:
- Front matter → unit=null, title="Preface"
- Chapter 1 → unit=1, title="Introduction"
- Chapter 2 → unit=2, title="Biology Basics"
"""
        ),
        (
            "user",
            f"""Extract the complete table of contents from the following document:

{document_content}
"""
        )
    ]





# from langchain_core.prompts import ChatPromptTemplate

# toc_prompt = ChatPromptTemplate.from_messages([
#     (
#         "system",
#         """You are an expert at extracting a structured table of contents from documents.

# IMPORTANT RULES:
# 1. Extract ALL content including front matter
# 2. Use unit=null for non-numbered sections
# 3. Use correct unit numbers for chapters
# 4. Include accurate page numbers
# 5. Preserve document order
# """
#     ),
#     (
#         "human",
#         "Extract the complete table of contents from this document:\n\n{document_content}"
#     )
# ])
