from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class WebsiteContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    
    # Hero Section
    hero_headline: str = "Build Your Dream Website"
    hero_subheadline: str = "METECHQ Web Development Solutions"
    hero_description: str = "Transform your vision into stunning reality with our premium web development services."
    hero_cta1_text: str = "Start Your Project"
    hero_cta2_text: str = "View Our Work"
    
    # Stats Section
    stat_projects_value: str = "50+"
    stat_projects_label: str = "Completed Projects"
    stat_clients_value: str = "35+"
    stat_clients_label: str = "Happy Clients"
    stat_experience_value: str = "3+"
    stat_experience_label: str = "Years Experience"
    stat_satisfaction_value: str = "98%"
    stat_satisfaction_label: str = "Client Satisfaction"
    
    # Services Section
    services_badge: str = "Our Services"
    services_title: str = "Premium Web Solutions"
    services_description: str = "Comprehensive development services tailored to elevate your digital presence"
    
    # Projects Section
    projects_badge: str = "Our Portfolio"
    projects_title: str = "Featured Projects"
    projects_description: str = "Explore our latest work and successful client collaborations"
    
    # Testimonials Section
    testimonials_badge: str = "Client Testimonials"
    testimonials_title: str = "What Our Clients Say"
    testimonials_description: str = "Trusted by businesses worldwide to deliver exceptional results"
    
    # CTA Section
    cta_heading: str = "Let's Build Your Website"
    cta_description: str = "Ready to transform your vision into reality? Let's create something extraordinary together."
    cta_button_text: str = "Get in Touch"
    
    # About Page
    about_title: str = "About METECHQ"
    about_description: str = "We are a team of passionate developers and designers."
    about_mission: str = "Our mission is to create exceptional digital experiences."
    about_vision: str = "Our vision is to be the leading web development agency."
    
    # Contact Page
    contact_title: str = "Get In Touch"
    contact_description: str = "Have a project in mind? Let's discuss how we can help."
    contact_email: str = "info@metechq.com"
    contact_phone: str = "+1 234 567 890"
    contact_address: str = "123 Main Street, City, Country"
    
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "hero_headline": "Build Your Dream Website",
                "stat_projects_value": "50+",
                "stat_clients_value": "35+"
            }
        }
