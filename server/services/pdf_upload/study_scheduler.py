import math
from typing import List, Dict, Any

# ---------------------------
# Flatten TOC
# --------------------------

def flatten_toc(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Flatten TOC into list of subtopics with page ranges."""
    for key in ("table_of_contents", "tableOfContents", "toc"):
        if key in data:
            flat_topics = []

            for unit in data[key]:
                chapter_title = unit.get("title")
                sections = unit.get("sections", [])

                for idx, sec in enumerate(sections):
                    start_page = sec.get("page", 0)

                    # determine end_page from next section
                    if idx + 1 < len(sections):
                        next_page = sections[idx + 1].get("page", start_page)
                        if next_page > start_page:
                            end_page = next_page - 1
                        else:
                            end_page = start_page
                    else:
                        # last section in chapter
                        end_page = start_page

                    flat_topics.append(
                        {
                            "chapter": chapter_title,
                            "title": sec.get("title"),
                            "start_page": start_page,
                            "end_page": end_page,
                            "content": ""
                        }
                    )

            return flat_topics

    raise ValueError("Unsupported TOC format")


# ---------------------------
# Group subtopics by chapter
# ---------------------------
def group_by_chapter(flat_topics: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    grouped: Dict[str, List[Dict[str, Any]]] = {}

    for item in flat_topics:
        grouped.setdefault(item["chapter"], []).append(
            {
                "title": item["title"],
                "start_page": item["start_page"],
                "end_page": item["end_page"],
                "content": item["content"],
            }
        )

    return [
        {"topic": chapter, "subtopics": subtopics}
        for chapter, subtopics in grouped.items()
    ]

# ---------------------------
# Generate study schedule
# ---------------------------
def generate_study_schedule_from_toc(toc_data: Dict[str, Any], total_days: int) -> List[Dict[str, Any]]:
    """Distribute topics evenly across days and group by chapter."""
    flat_topics = flatten_toc(toc_data)
    topics_per_day = max(1, math.ceil(len(flat_topics) / total_days))
    schedule = []
    day = 1
    for i in range(0, len(flat_topics), topics_per_day):
        day_slice = flat_topics[i:i + topics_per_day]
        grouped_topics = group_by_chapter(day_slice)
        schedule.append({"day": day, "topics": grouped_topics})
        day += 1
    return schedule
