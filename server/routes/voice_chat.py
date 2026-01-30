from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.speech.stt import transcribe_audio
from services.chatbot.chat import chat_with_context
from utils.audio import save_temp_audio, cleanup_audio

router = APIRouter(prefix="/api/voice", tags=["chat_bot"])


@router.post("/chat")
async def voice_chat(
    audio: UploadFile = File(...),
    user_id: str = Form(...),
    pdf_hash: str = Form(...),
    day: int | None = Form(None),
    topic: int | None = Form(None),
    subtopic: int | None = Form(None),
):
    """
    🎤 Voice → Text → Chatbot → Text
    """

    audio_path = None

    try:
        # 1️⃣ Save audio
        audio_path = save_temp_audio(audio)

        # 2️⃣ Speech → Text
        user_text = transcribe_audio(audio_path)

        if not user_text:
            raise HTTPException(400, "Could not understand audio")

        # 3️⃣ Chatbot response
        bot_response = await chat_with_context(
            user_id=user_id,
            pdf_hash=pdf_hash,
            message=user_text,
            day=day,
            topic=topic,
            subtopic=subtopic,
        )

        return {
            "input_text": user_text,
            "response": bot_response,
            "mode": "voice",
        }

    finally:
        cleanup_audio(audio_path)
