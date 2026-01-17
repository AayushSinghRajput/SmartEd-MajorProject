import random
from concurrent.futures import ThreadPoolExecutor, as_completed

from services.mcq.keyword_extractor import extract_keywords
from services.mcq.question import generate_question
from services.mcq.distractor_generator import generate_distractors


def _generate_single_mcq(context: str, kw: str) -> dict:
    """
    Generate a single MCQ for a keyword.
    Runs safely inside a thread.
    """
    question_text = generate_question(context, kw)

    distractors = generate_distractors(
        context=context,
        question=question_text,
        correct_answer=kw
    )

    # Combine correct answer + distractors (remove duplicates)
    options = list(set(distractors + [kw]))

    # Shuffle so correct answer is at random position
    random.shuffle(options)

    # Index of correct answer
    answer_index = options.index(kw)

    return {
        "question": question_text,
        "options": options,
        "answer_index": answer_index
    }


def mcq_generator(context: str, num_questions: int = 5):
    """
    Generate MCQs from a given context using parallel processing.
    """
    keywords = extract_keywords(context, num_keywords=num_questions)

    mcqs = []

    # Limit threads to avoid overload (important for FastAPI)
    max_workers = min(6, len(keywords))

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(_generate_single_mcq, context, kw)
            for kw in keywords
        ]

        for future in as_completed(futures):
            mcqs.append(future.result())

    return mcqs


# -------------------------
# Example usage (local test)
# -------------------------
if __name__ == "__main__":
    context = (
        "The periodic table is a tabular arrangement of chemical elements "
        "organized by increasing atomic number and recurring chemical properties. "
        "Developed primarily by Dmitri Mendeleev in 1869, it consists of periods "
        "(horizontal rows) and groups (vertical columns)."
    )

    mcqs = mcq_generator(context, num_questions=5)

    print("\nGenerated MCQs:\n")
    for i, mcq in enumerate(mcqs, 1):
        print(f"MCQ {i}")
        print("Question:", mcq["question"])
        print("Options:", mcq["options"])
        print("Answer index:", mcq["answer_index"])
        print("-" * 50)