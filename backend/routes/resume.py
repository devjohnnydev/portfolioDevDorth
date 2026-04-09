from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models import Profile, Experience, Project, Skill, Certification
from services.pdf_generator import generate_resume_pdf
import traceback

router = APIRouter()

@router.get("/resume/generate")
def generate_resume(db: Session = Depends(get_db)):
    try:
        # Fetch all data needed for resume
        profile = db.query(Profile).first()
        
        # If no profile exists, create a dummy one so it doesn't crash on empty DB
        if not profile:
            profile = Profile(
                name="Desenvolvedor",
                title="Fullstack Developer",
                bio="Portfolio profissional.",
                email=""
            )
            
        experiences = db.query(Experience).order_by(Experience.id.desc()).all()
        projects = db.query(Project).all()
        skills = db.query(Skill).all()
        certifications = db.query(Certification).all()
        
        pdf_buffer = generate_resume_pdf(profile, experiences, projects, skills, certifications)
        
        # Build safe filename
        name = getattr(profile, 'name', 'Curriculo') or 'Curriculo'
        safe_name = ''.join(c if c.isalnum() or c in (' ', '_', '-') else '_' for c in name)
        safe_name = safe_name.replace(' ', '_')
        filename = f"Curriculo_{safe_name}.pdf"
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition",
            }
        )
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"detail": f"Erro ao gerar PDF: {str(e)}"}
        )
