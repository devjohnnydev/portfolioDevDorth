import os
from dotenv import load_dotenv

load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")
# Fix Railway PostgreSQL URLs
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# JWT
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Admin
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@portfolio.dev")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")  # Will be hashed on first run

# CORS — use "*" to allow all origins (safe for public portfolio)
_cors_raw = os.getenv("CORS_ORIGINS", "*")
CORS_ORIGINS = ["*"] if _cors_raw.strip() == "*" else [o.strip() for o in _cors_raw.split(",") if o.strip()]

# Upload
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5MB

# App
APP_NAME = os.getenv("APP_NAME", "Carlos Eduardo — Portfolio API")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"
PORT = int(os.getenv("PORT", "8000"))
