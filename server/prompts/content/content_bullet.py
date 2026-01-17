

# ---------------------------
# Prompt builder for bullet extraction
# ---------------------------
def build_bullet_prompt(topic: str, content: str) -> str:
    return f"""
You are a teacher creating revision notes.

Topic: {topic}

Study Content:
{content}

Task:
- Extract ONLY important bullet points
- Each bullet should be short and factual
- Cover definitions, key ideas, and examples
- Do NOT add new information
- Do NOT repeat sentences verbatim

Output format:
- Bullet points only
- Use markdown
"""
