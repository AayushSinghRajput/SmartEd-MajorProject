from typing import TypedDict, Annotated, List
from datetime import datetime

from langchain_core.messages import (
    BaseMessage,
    HumanMessage,
    AIMessage,
    SystemMessage
)
from langgraph.graph import StateGraph, START, END
from langgraph.graph import add_messages

from core.llm import get_llm
from db.config import db
from services.chatbot.context_fetcher_subtopic import fetch_subtopic_content
from prompts.chat.context import build_context_prompt

# -------------------------
# LLM
# -------------------------
llm = get_llm(temperature=0.3)


# -------------------------
# Config
# -------------------------
MAX_HISTORY = 5


# -------------------------
# State
# -------------------------
class ChatState(TypedDict):
    user_id: str
    pdf_hash: str
    day: int          # index (1-based)
    topic: int        # index (0-based)
    subtopic: int     # index (0-based)
    messages: Annotated[List[BaseMessage], add_messages]


# -------------------------
# MongoDB helpers
# -------------------------
async def save_message(
    user_id: str,
    pdf_hash: str,
    role: str,
    content: str
):
    await db.chat_messages.insert_one({
        "user_id": user_id,
        "pdf_hash": pdf_hash,
        "role": role,
        "content": content,
        "created_at": datetime.utcnow()
    })


async def load_chat_history(
    user_id: str,
    pdf_hash: str,
    limit: int
) -> List[BaseMessage]:
    cursor = (
        db.chat_messages
        .find({
            "user_id": user_id,
            "pdf_hash": pdf_hash
        })
        .sort("created_at", 1)
    )

    messages: List[BaseMessage] = []

    async for doc in cursor:
        if doc["role"] == "user":
            messages.append(HumanMessage(content=doc["content"]))
        elif doc["role"] == "assistant":
            messages.append(AIMessage(content=doc["content"]))

    return messages[-limit:]



# -------------------------
# Chat Node
# -------------------------
async def chat_node(state: ChatState) -> ChatState:
    user_id = state["user_id"]
    pdf_hash = state["pdf_hash"]

    day_idx = state["day"]
    topic_idx = state["topic"]
    subtopic_idx = state["subtopic"]

    user_message = state["messages"][-1]

    # 1️⃣ Load previous chat (user + pdf)
    history = await load_chat_history(
        user_id=user_id,
        pdf_hash=pdf_hash,
        limit=MAX_HISTORY
    )

    # 2️⃣ Fetch study context using INDEXES
    ctx = await fetch_subtopic_content(
        pdf_hash=pdf_hash,
        day_index=day_idx,
        topic_index=topic_idx,
        subtopic_index=subtopic_idx
    )

    context_text = ctx.get("content", "").strip()

    # Debug (safe to remove later)
    print("Context length:", len(context_text))

    # 3️⃣ Build system prompt (ONLY context)
    system_prompt = build_context_prompt(context_text)

    messages = [SystemMessage(content=system_prompt)] + history

    # 4️⃣ Add user message
    messages.append(user_message)
    await save_message(user_id, pdf_hash, "user", user_message.content)

    # 5️⃣ Call LLM
    response = llm.invoke(messages)

    # 6️⃣ Save assistant message
    await save_message(user_id, pdf_hash, "assistant", response.content)

    return {"messages": [response]}


# -------------------------
# Graph
# -------------------------
graph = StateGraph(ChatState)
graph.add_node("chat_node", chat_node)
graph.add_edge(START, "chat_node")
graph.add_edge("chat_node", END)

chatbot = graph.compile()


# -------------------------
# Public helper (TEXT / VOICE)
# -------------------------
async def chat_with_context(
    user_id: str,
    pdf_hash: str,
    message: str,
    day: int | None = None,
    topic: int | None = None,
    subtopic: int | None = None,
) -> str:
    """
    Unified entry point for:
    - text chat
    - voice chat
    """

    result = await chatbot.ainvoke({
        "user_id": user_id,
        "pdf_hash": pdf_hash,
        "day": day,
        "topic": topic,
        "subtopic": subtopic,
        "messages": [HumanMessage(content=message)],
    })

    return result["messages"][-1].content



# if __name__ == "__main__":
    # while True:
    #     user_input = input("\nYou: ")

    #     if user_input.lower() in ["exit", "quit"]:
    #         break

    #     result = chatbot.invoke(
    #         {"messages": [HumanMessage(content=user_input)]},
    #         config=config
    #     )

    #     print("AI:", result["messages"][-1].content)
