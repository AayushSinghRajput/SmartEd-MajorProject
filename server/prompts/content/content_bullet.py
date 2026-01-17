
# ---------------------------
# # Prompt builder for bullet extraction
# # ---------------------------

# def build_bullet_prompt(topic: str, content: str) -> str:
#     return f"""
# You are a teacher creating revision notes.

# Topic: {topic}

# Study Content:
# {content}

# Task:
# - Extract ONLY important bullet points
# - Each bullet should be short and factual
# - Cover definitions, key ideas, and examples
# - Do NOT add new information
# - Do NOT repeat sentences verbatim

# Output format:
# - Bullet points only
# - Use markdown
# """

def build_content_prompt(content: str) -> str:
    return f"""
You are an experienced teacher simplifying study material.
Below is study content. Rewrite it in **easy, student-friendly language**.

STUDY CONTENT:
{content}

INSTRUCTIONS:
- Explain the same content in simpler words
- Keep the meaning and flow close to the original
- Use clear markdown headings (##, ###) where helpful
- Use bullet points only when they improve clarity
- Add examples ONLY if they help understanding
- Do NOT add new topics or extra depth
- Do NOT make it longer than the original content
- Keep it concise and readable

OUTPUT RULES:
- Return ONLY the rewritten content
- Do NOT include topic or subtopic titles
- Do NOT add introductions or conclusions
- Use markdown formatting
"""
