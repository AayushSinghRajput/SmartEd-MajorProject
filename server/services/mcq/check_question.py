from core.llm import get_llm
import json


def validate_and_fix_mcqs(context: str, mcqs: list[dict]) -> list[dict]:
    """
    Validate and fix MCQs using LLM.
    Returns corrected MCQs in SAME format.
    """

    llm = get_llm(temperature=0.2)

    prompt = [
        (
            "system",
            """
You are an expert academic reviewer.

Your task:
1. Verify whether each MCQ is correct based on the given context.
2. Ensure:
   - Question is clear
   - Only one correct answer
   - answer_index matches correct option
   - Options are not duplicated
3. If incorrect, rewrite the MCQ properly.
4. Return ONLY valid JSON.
5. Keep EXACT same format:
[
  {
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "answer_index": 0
  }
]
"""
        ),
        (
            "user",
            f"""
Context:
{context}

MCQs:
{json.dumps(mcqs, indent=2)}
"""
        )
    ]

    response = llm.invoke(prompt)

    try:
        corrected_mcqs = json.loads(response.text)
        return corrected_mcqs
    except Exception:
        # If LLM output fails → return original (safe fallback)
        print("LLM failed to correct MCQs, returning original. Error:", response.text)
        return mcqs