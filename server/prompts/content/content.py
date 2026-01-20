
def content_prompt(content: str) -> str: 
    return f"""
# You are a teacher creating clear, structured study notes.

# PDF Content:
# {content}

# Explain simply using:
# - Headings
# - Bullet points
# - Examples
# - Key takeaways
# - Response text content similar to number of words in PDF content

# Use markdown formatting.
# """


# def content_prompt(content: str) -> str:
#     return f"""
# You are an experienced teacher simplifying study material.
# Below is study content. Rewrite it in **easy, student-friendly language**.

# STUDY CONTENT:
# {content}

# INSTRUCTIONS:
# - Explain the same content in simpler words
# - Keep the meaning and flow close to the original
# - Use clear markdown headings (##, ###) where helpful
# - Add examples ONLY if they help understanding
# - Do NOT add new topics or extra depth
# - Do NOT make it longer than the original content
# - Keep it concise and readable

# OUTPUT RULES:
# - Return ONLY the rewritten content
# - Do NOT include topic or subtopic titles
# - Do NOT add introductions or conclusions
# - Use markdown formatting
# """
