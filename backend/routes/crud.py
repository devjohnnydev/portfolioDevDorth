from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Project, Skill, Certification, Experience, Profile
from schemas import (
    Project as ProjectSchema, ProjectCreate,
    Skill as SkillSchema, SkillCreate,
    Certification as CertSchema, CertificationCreate,
    Experience as ExpSchema, ExperienceCreate,
    Profile as ProfileSchema, ProfileCreate
)
from auth import get_current_active_user

router = APIRouter()

# --- Projects ---
@router.get("/projects", response_model=List[ProjectSchema])
def get_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Project).offset(skip).limit(limit).all()

@router.post("/projects", response_model=ProjectSchema)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_project = Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/projects/{project_id}", response_model=ProjectSchema)
def update_project(project_id: int, project: ProjectCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in project.model_dump().items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"ok": True}

# --- Skills ---
@router.get("/skills", response_model=List[SkillSchema])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()

@router.post("/skills", response_model=SkillSchema)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_skill = Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.put("/skills/{skill_id}", response_model=SkillSchema)
def update_skill(skill_id: int, skill: SkillCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    for key, value in skill.model_dump().items():
        setattr(db_skill, key, value)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.delete("/skills/{skill_id}")
def delete_skill(skill_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(db_skill)
    db.commit()
    return {"ok": True}

# --- Certifications ---
@router.get("/certifications", response_model=List[CertSchema])
def get_certifications(db: Session = Depends(get_db)):
    return db.query(Certification).all()

@router.post("/certifications", response_model=CertSchema)
def create_certification(cert: CertificationCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_cert = Certification(**cert.model_dump())
    db.add(db_cert)
    db.commit()
    db.refresh(db_cert)
    return db_cert

@router.put("/certifications/{cert_id}", response_model=CertSchema)
def update_certification(cert_id: int, cert: CertificationCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    for key, value in cert.model_dump().items():
        setattr(db_cert, key, value)
    db.commit()
    db.refresh(db_cert)
    return db_cert

@router.delete("/certifications/{cert_id}")
def delete_certification(cert_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_cert = db.query(Certification).filter(Certification.id == cert_id).first()
    if not db_cert:
        raise HTTPException(status_code=404, detail="Certification not found")
    db.delete(db_cert)
    db.commit()
    return {"ok": True}

# --- Experiences ---
@router.get("/experiences", response_model=List[ExpSchema])
def get_experiences(db: Session = Depends(get_db)):
    return db.query(Experience).all()

@router.post("/experiences", response_model=ExpSchema)
def create_experience(exp: ExperienceCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_exp = Experience(**exp.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@router.put("/experiences/{exp_id}", response_model=ExpSchema)
def update_experience(exp_id: int, exp: ExperienceCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    for key, value in exp.model_dump().items():
        setattr(db_exp, key, value)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@router.delete("/experiences/{exp_id}")
def delete_experience(exp_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(db_exp)
    db.commit()
    return {"ok": True}

# --- Profile ---
@router.get("/profile", response_model=ProfileSchema)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile", response_model=ProfileSchema)
def update_profile(profile_data: ProfileCreate, db: Session = Depends(get_db), current_user = Depends(get_current_active_user)):
    db_profile = db.query(Profile).first()
    if not db_profile:
        db_profile = Profile(**profile_data.model_dump())
        db.add(db_profile)
    else:
        for key, value in profile_data.model_dump().items():
            setattr(db_profile, key, value)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile
