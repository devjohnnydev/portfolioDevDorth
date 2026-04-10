from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, TIMESTAMP, Float, ARRAY, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    email = Column(String, nullable=True)
    location = Column(String, nullable=True)
    social_links = Column(JSON, nullable=True) # {"github": "url", "linkedin": "url", "email": "...", "instagram": "...", "whatsapp": "..."}
    stats = Column(JSON, nullable=True) # [{"label": "Anos de exp.", "value": "3+"}, ...]
    dashboard_metrics = Column(JSON, nullable=True) # [{"label": "Linhas de Código", "value": 15000, "suffix": "+", "color": "#3B82F6"}, ...]
    dashboard_languages = Column(JSON, nullable=True) # [{"name": "JavaScript", "percentage": 35, "color": "#F7DF1E"}, ...]
    dashboard_activity = Column(JSON, nullable=True) # [{"date": "Hoje", "action": "Deploy", "project": "..."}, ...]
    hero_headlines = Column(JSON, nullable=True) # ["Construindo sistemas...", ...]
    about_title = Column(String, nullable=True)
    about_subtitle = Column(Text, nullable=True)
    about_image_url = Column(String, nullable=True)
    resume_config = Column(JSON, nullable=True)
    resume_languages = Column(JSON, nullable=True)  # [{"name": "Português", "level": "Nativo"}, ...]
    resume_education = Column(JSON, nullable=True)  # [{"title": "...", "institution": "...", "period": "..."}]
    resume_website = Column(String, nullable=True)
    dashboard_section_config = Column(JSON, nullable=True) # {"badge": "Dashboard", "title": "Métricas & Analytics", "subtitle": "...", "languagesTitle": "...", "activityTitle": "..."}
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())

from sqlalchemy import LargeBinary

class DbFile(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    data = Column(LargeBinary, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    long_description = Column(Text, nullable=True)
    category = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    tech = Column(String, nullable=True) # comma separated tech stack for simplicity
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
    featured = Column(Boolean, default=False)
    highlights = Column(JSON, nullable=True) # list of highlights
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Frontend, Backend, etc.
    proficiency = Column(Integer, default=50) # 0-100
    icon = Column(String, nullable=True) # Lucide icon name

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    institution = Column(String, nullable=False)
    date = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    badge_url = Column(String, nullable=True)
    credential_url = Column(String, nullable=True)
    category = Column(String, nullable=True)
    file_url = Column(String, nullable=True)

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    period = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String, default="work") # work, education, milestone
