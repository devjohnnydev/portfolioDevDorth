from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS, DEBUG, APP_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
from database import engine, Base, SessionLocal
from models import User
from auth import get_password_hash
from routes import auth, crud, resume

# Auto-migrate: create all tables if they don't exist
Base.metadata.create_all(bind=engine)

# Seed initial admin user if not exists
def seed_admin():
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if not admin_user:
            hashed_pw = get_password_hash(ADMIN_PASSWORD)
            new_admin = User(email=ADMIN_EMAIL, hashed_password=hashed_pw, is_active=True)
            db.add(new_admin)
            db.commit()
            print(f"Created default admin user: {ADMIN_EMAIL}")
    except Exception as e:
        print(f"Error seeding admin user: {e}")
    finally:
        db.close()

seed_admin()

app = FastAPI(title=APP_NAME, debug=DEBUG)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(resume.router, prefix="/api", tags=["resume"])
app.include_router(crud.router, prefix="/api", tags=["crud"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
