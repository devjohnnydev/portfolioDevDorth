from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Profile, Experience, Project, Skill
from ..services.pdf_generator import generate_resume_pdf

router = APIRouter()

@router.get("/resume/generate")
def generate_resume(db: Session = Depends(get_db)):
    # Fetch all data needed for resume
    profile = db.query(Profile).first()
    
    # If no profile exists, create a dummy one for the resume so it doesn't crash on completely empty DB
    if not profile:
        profile = Profile(
            name="Carlos Eduardo",
            title="Fullstack Developer",
            bio="Construindo sistemas que escalam ideias. Foco em experiência do usuário e arquitetura de software.",
            email="contato@carloseduardo.dev"
        )
        
    experiences = db.query(Experience).order_by(Experience.id.desc()).all()
    projects = db.query(Project).filter(Project.featured == True).all()
    skills = db.query(Skill).all()
    
    pdf_buffer = generate_resume_pdf(profile, experiences, projects, skills)
    
    filename = f"Curriculo_{profile.name.replace(' ', '_')}.pdf" if profile and profile.name else "Curriculo.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
