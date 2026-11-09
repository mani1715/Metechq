"""Contact Page Content Model"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ContactHero(BaseModel):
    """Contact hero section"""
    title: str = "Get in Touch"
    subtitle: str = "Let's discuss your project and bring your vision to life"
    description: str = "We're here to help you transform your ideas into reality."

class FormField(BaseModel):
    """Form field configuration"""
    label: str
    placeholder: Optional[str] = ""
    required: bool = False
    type: str = "text"
    options: Optional[List[Dict[str, str]]] = None
    rows: Optional[int] = None

class ContactForm(BaseModel):
    """Contact form configuration"""
    title: str = "Send Us a Message"
    subtitle: str = "Fill out the form below and we'll get back to you within 24 hours"
    fields: Dict[str, FormField]
    submitButton: Dict[str, str]
    messages: Dict[str, Dict[str, str]]

class ContactInfoCard(BaseModel):
    """Contact information card"""
    id: int
    icon: str
    label: str
    value: str
    href: Optional[str] = None
    description: str

class ContactInfo(BaseModel):
    """Contact information section"""
    title: str = "Contact Information"
    subtitle: str = "Feel free to reach out through any of these channels"
    cards: List[ContactInfoCard]

class BusinessHourSchedule(BaseModel):
    """Business hour schedule item"""
    day: str
    hours: str
    available: bool = True

class BusinessHours(BaseModel):
    """Business hours section"""
    title: str = "Business Hours"
    schedule: List[BusinessHourSchedule]
    timezone: str = "IST (Indian Standard Time)"
    note: str = "We respond to all inquiries within 24 business hours"

class FAQItem(BaseModel):
    """FAQ item"""
    id: int
    question: str
    answer: str

class FAQ(BaseModel):
    """FAQ section"""
    title: str = "Frequently Asked Questions"
    subtitle: str = "Quick answers to common questions about working with us"
    questions: List[FAQItem]

class CTAStats(BaseModel):
    """CTA statistics"""
    value: str
    label: str

class CTAButton(BaseModel):
    """CTA button"""
    text: str
    link: str

class CTA(BaseModel):
    """CTA section"""
    title: str = "Ready to Start Your Project?"
    subtitle: str = "Let's turn your vision into reality"
    description: str = "Join 10+ satisfied clients who have transformed their businesses"
    primaryButton: CTAButton
    secondaryButton: CTAButton
    stats: List[CTAStats]

class ContactPageContent(BaseModel):
    """Complete contact page content model"""
    id: Optional[str] = None
    hero: ContactHero
    form: ContactForm
    contactInfo: ContactInfo
    businessHours: BusinessHours
    faq: FAQ
    cta: CTA
    updated_at: Optional[str] = None
    updated_by: Optional[str] = None

class ContactPageUpdate(BaseModel):
    """Update model for contact page"""
    hero: Optional[ContactHero] = None
    form: Optional[ContactForm] = None
    contactInfo: Optional[ContactInfo] = None
    businessHours: Optional[BusinessHours] = None
    faq: Optional[FAQ] = None
    cta: Optional[CTA] = None
