import math
from typing import List, Dict, Any


def generate_schedule_from_pages(
    total_pages: int,
    total_days: int
) -> List[Dict[str, Any]]:
    """
    Universal fallback:
    - Each day = topic
    - Each page = subtopic
    """

    if total_pages <= 0:
        total_pages = total_days  # safety fallback

    pages_per_day = math.ceil(total_pages / total_days)
    schedule: List[Dict[str, Any]] = []

    current_page = 1

    for day in range(1, total_days + 1):
        day_start = current_page
        day_end = min(current_page + pages_per_day - 1, total_pages)

        subtopics = []
        for page in range(day_start, day_end + 1):
            subtopics.append(
                {
                    "title": f"Page {page}",
                    "start_page": page,
                    "end_page": page,
                    "content": ""
                }
            )

        schedule.append(
            {
                "day": day,
                "topics": [
                    {
                        "topic": f"Pages {day_start}–{day_end}",
                        "subtopics": subtopics
                    }
                ]
            }
        )

        current_page = day_end + 1
        if current_page > total_pages:
            break

    return schedule
