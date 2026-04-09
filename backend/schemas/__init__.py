from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class ProfileBase(BaseModel):
    name: str
    title: str
    bio: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    social_links: Optional[Dict[str, Any]] = None
    stats: Optional[List[Dict[str, Any]]] = None
    dashboard_metrics: Optional[List[Dict[str, Any]]] = None
    dashboard_languages: Optional[List[Dict[str, Any]]] = None
    dashboard_activity: Optional[List[Dict[str, Any]]] = None
    hero_headlines: Optional[List[str]] = None
    about_title: Optional[str] = None
    about_subtitle: Optional[str] = None
    resume_config: Optional[dict] = None

class ProfileCreate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: int

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    long_description: Optional[str] = None
    category: str
    image_url: Optional[str] = None
    tech: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    featured: bool = False
    highlights: Optional[List[str]] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True

class SkillBase(BaseModel):
    name: str
    category: str
    proficiency: int = 50
    icon: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int

    class Config:
        from_attributes = True

class CertificationBase(BaseModel):
    title: str
    institution: str
    date: Optional[str] = None
    description: Optional[str] = None
    badge_url: Optional[str] = None
    credential_url: Optional[str] = None

class CertificationCreate(CertificationBase):
    pass

class Certification(CertificationBase):
    id: int

    class Config:
        from_attributes = True

class ExperienceBase(BaseModel):
    title: str
    company: str
    period: str
    description: Optional[str] = None
    type: str = "work"

class ExperienceCreate(ExperienceBase):
    pass

class Experience(ExperienceBase):
    id: int

    class Config:
        from_attributes = True
