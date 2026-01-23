from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # LLM providers
    GOOGLE_API_KEY: str | None = None
    GROQ_API_KEY: str | None = None
    AZURE_OPENAI_API_KEY: str | None = None
    AZURE_OPENAI_ENDPOINT: str | None = None
    AZURE_OPENAI_DEPLOYMENT: str | None = None
    AZURE_OPENAI_API_VERSION: str | None = None
    #Google
    GOOGLE_SEARCH_API_KEY: str | None = None
    GOOGLE_SEARCH_ENGINE_ID: str | None = None
    # Database & auth
    MONGO_URI: str
    DB_NAME: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"

    #Cloudinary
    CLOUDINARY_CLOUD_NAME : str
    CLOUDINARY_API_KEY : str
    CLOUDINARY_API_SECRET : str

    # ---------------- OCR ----------------
    POPPLER_PATH: str | None = None
    TESSERACT_PATH: str | None = None


    ENV: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="forbid"
    )


settings = Settings()