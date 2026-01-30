import os
from groq import Groq
from core.llm import get_llm
from core.config import settings

# client = get_llm(provider="groq")
GROQ_API_KEY = settings.GROQ_API_KEY

# ✅ RAW Groq client (NOT ChatGroq)
client = Groq(api_key=GROQ_API_KEY)



def transcribe_audio(audio_path: str) -> str:
    """
    Transcribe English speech → text using Groq Whisper
    """
    with open(audio_path, "rb") as audio_file:
        result = client.audio.transcriptions.create(
            file=(os.path.basename(audio_path), audio_file.read()),
            model="whisper-large-v3",
            response_format="json"
        )

    return result.text.strip()
