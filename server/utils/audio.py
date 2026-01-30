import uuid
import os
import shutil
from fastapi import UploadFile

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_temp_audio(audio: UploadFile) -> str:
    # ✅ Force correct extension for Whisper/Groq
    filename = f"{uuid.uuid4()}.webm"
    path = os.path.join(UPLOAD_DIR, filename)

    with open(path, "wb") as f:
        shutil.copyfileobj(audio.file, f)

    return path


def cleanup_audio(path: str):
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except Exception:
        pass
