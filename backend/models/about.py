from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class AboutValue(BaseModel):
    """Individual value/principle"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    icon: str  # Icon name (Award, Target, Zap, Shield, etc.)
    title: str
    description: str

class AboutAchievement(BaseModel):
    """Achievement/Number item"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    icon: str  # Icon name
    value: str  # e.g., "50+", "35+"
    label: str  # e.g., "Projects Completed"

class AboutExpertise(BaseModel):
    """Expertise item"""
    text: str

class AboutStory(BaseModel):
    """Story section"""
    title: str
    paragraphs: List[str]
    expertise: List[str]

class AboutFounder(BaseModel):
    """Founder information"""
    name: str
    role: str
    bio: str
    skills: List[str]
    show_image: bool = False  # User wants to hide image
    image_url: Optional[str] = None

class AboutCTA(BaseModel):
    """Call to action section"""
    title: str
    description: str
    button_text: str
    button_link: str

class AboutContent(BaseModel):
    """Complete About page content"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    # Hero Section
    hero_title: str
    hero_subtitle: str
    hero_description: str
    hero_badge: str = "Premium Web Development Agency"
    
    # Story Section
    story_title: str
    story_paragraphs: List[str]
    story_expertise: List[str]
    
    # Values Section
    values_badge: str = "Our Values"
    values_title: str = "Principles That Drive Us"
    values_description: str = "The core values that guide every project and client relationship"
    values: List[AboutValue]
    
    # Achievements Section (Numbers That Speak)
    achievements_badge: str = "Achievements"
    achievements_title: str = "Numbers That Speak"
    achievements: List[AboutAchievement]
    
    # Founder Section
    founder_badge: str = "Meet the Founder"
    founder_title: str = "The Mind Behind METECHQ"
    founder_name: str
    founder_role: str
    founder_bio: str
    founder_skills: List[str]
    founder_show_image: bool = False
    founder_image_url: Optional[str] = None
    
    # CTA Section
    cta_title: str
    cta_description: str
    cta_button_text: str
    cta_button_link: str = "/contact"
    
    # Metadata
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_by: Optional[str] = None
