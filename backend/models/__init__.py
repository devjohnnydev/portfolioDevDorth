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
    social_links = Column(JSON, nullable=True) # e.g. {"github": "url", "linkedin": "url"}
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())

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

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    period = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String, default="work") # work, education, milestone
