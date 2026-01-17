from schemas.chatbot import ChatRequest
from fastapi import APIRouter
from services.chatbot.chat import chatbot
from langchain_core.messages import HumanMessage

router = APIRouter(prefix="/api/chat", tags=["chat_bot"])

@router.post("/aichat")
async def chat(request: ChatRequest):
    result = await chatbot.ainvoke({
        "user_id": request.user_id,
        "pdf_hash": request.pdf_hash,
        "day": request.day,
        "topic": request.topic,
        "subtopic": request.subtopic,
        "messages": [HumanMessage(content=request.message)]
    })


    return {
        "response": result["messages"][-1].content
    }
