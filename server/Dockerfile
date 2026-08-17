FROM python:3.11-slim

WORKDIR /app

# System deps: tesseract/poppler for OCR, ffmpeg for audio (pydub), build-essential for
# any C-extension wheels that don't ship prebuilt binaries.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    tesseract-ocr \
    poppler-utils \
    ffmpeg \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
