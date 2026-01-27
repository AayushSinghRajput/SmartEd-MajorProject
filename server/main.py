from fastapi import FastAPI
from routes import auth
from routes import content
from routes import pdf
from routes import mcq
from routes import predefined
from routes import mock_routes
from routes import notes_summarizer
from fastapi.middleware.cors import CORSMiddleware
from routes import chat_api
from routes import contact
from routes import performance
from routes import progress
from routes import community
from routes import entrance_news



app = FastAPI(
    title="AI Virtual Teacher",
    description="AI Teacher that converts textbooks into daily lessons",
    version="1.0.0",
)

# Allow CORS (Optional)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   

app.include_router(auth.router)
app.include_router(pdf.router)
app.include_router(content.router)
app.include_router(mcq.router)
app.include_router(predefined.router)
app.include_router(mock_routes.router)
app.include_router(notes_summarizer.router)
app.include_router(contact.router)
app.include_router(chat_api.router)
app.include_router(performance.router)
app.include_router(progress.router)
app.include_router(community.router)
app.include_router(entrance_news.router)

@app.get("/")
def root():
    return {"message": "Backend is running"}
