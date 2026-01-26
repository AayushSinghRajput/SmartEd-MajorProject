def calculate_performance(score: int, total_questions: int):
    percentage = (score / total_questions) * 100

    if percentage <= 40:
        level = "bad"
    elif percentage <= 70:
        level = "medium"
    else:
        level = "good"

    return round(percentage, 2), level
