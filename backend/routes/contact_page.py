from auth.admin_auth import require_permission
"""Contact Page Content Routes"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from datetime import datetime
from database import contact_page_collection
from models.contact_page import ContactPageContent, ContactPageUpdate
from auth.admin_auth import get_current_admin
import uuid

router = APIRouter(prefix="/contact-page", tags=["Contact Page"])

@router.get("/", response_model=Dict[str, Any])
async def get_contact_page():
    """Get contact page content (public)"""
    try:
        content = await contact_page_collection.find_one()
        
        if not content:
            # Return default content if none exists
            return get_default_contact_content()
        
        # Remove MongoDB _id field
        content.pop('_id', None)
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/", response_model=Dict[str, Any])
async def update_contact_page(
    content: ContactPageUpdate,
    current_admin: dict = Depends(require_permission("canManageContactPage"))
):
    """Update contact page content (admin only)"""
    try:
        # Get existing content
        existing = await contact_page_collection.find_one()
        
        if not existing:
            # Create new if doesn't exist
            existing = get_default_contact_content()
        
        # Update only provided fields
        update_data = content.dict(exclude_unset=True)
        
        # Merge with existing content
        for key, value in update_data.items():
            if value is not None:
                existing[key] = value
        
        # Add metadata
        existing['updated_at'] = datetime.utcnow().isoformat()
        existing['updated_by'] = current_admin.get('username', 'admin')
        
        # Ensure id exists
        if 'id' not in existing:
            existing['id'] = str(uuid.uuid4())
        
        # Update or insert
        await contact_page_collection.update_one(
            {},
            {'$set': existing},
            upsert=True
        )
        
        # Remove MongoDB _id field
        existing.pop('_id', None)
        return existing
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reset")
async def reset_contact_page(current_admin: dict = Depends(require_permission("canManageContactPage"))):
    """Reset contact page to default content (admin only)"""
    try:
        default_content = get_default_contact_content()
        default_content['updated_at'] = datetime.utcnow().isoformat()
        default_content['updated_by'] = current_admin.get('username', 'admin')
        
        await contact_page_collection.delete_many({})
        await contact_page_collection.insert_one(default_content)
        
        default_content.pop('_id', None)
        return {"message": "Contact page reset to default", "content": default_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_default_contact_content() -> Dict[str, Any]:
    """Get default contact page content"""
    return {
        "id": str(uuid.uuid4()),
        "hero": {
            "title": "Get in Touch",
            "subtitle": "Let's discuss your project and bring your vision to life",
            "description": "We're here to help you transform your ideas into reality. Reach out and let's start building something amazing together."
        },
        "form": {
            "title": "Send Us a Message",
            "subtitle": "Fill out the form below and we'll get back to you within 24 hours",
            "fields": {
                "fullName": {
                    "label": "Full Name",
                    "placeholder": "John Doe",
                    "required": True,
                    "type": "text"
                },
                "email": {
                    "label": "Email Address",
                    "placeholder": "john@example.com",
                    "required": True,
                    "type": "email"
                },
                "phone": {
                    "label": "Phone Number",
                    "placeholder": "+1 (555) 123-4567",
                    "required": False,
                    "type": "tel"
                },
                "service": {
                    "label": "Service Interested In",
                    "placeholder": "Select a service",
                    "required": True,
                    "type": "select",
                    "options": [
                        {"value": "", "label": "Select a service"},
                        {"value": "website", "label": "Website Development"},
                        {"value": "ecommerce", "label": "E-commerce Solutions"},
                        {"value": "fullstack", "label": "Full Stack Development"},
                        {"value": "uiux", "label": "UI/UX Design"},
                        {"value": "consulting", "label": "Technical Consulting"},
                        {"value": "other", "label": "Other Services"}
                    ]
                },
                "budget": {
                    "label": "Project Budget (Optional)",
                    "placeholder": "Select your budget range",
                    "required": False,
                    "type": "select",
                    "options": [
                        {"value": "", "label": "Select budget range"},
                        {"value": "small", "label": "Under $5,000"},
                        {"value": "medium", "label": "$5,000 - $15,000"},
                        {"value": "large", "label": "$15,000 - $50,000"},
                        {"value": "enterprise", "label": "$50,000+"},
                        {"value": "discuss", "label": "Let's Discuss"}
                    ]
                },
                "message": {
                    "label": "Message",
                    "placeholder": "Tell us about your project, goals, and timeline...",
                    "required": True,
                    "type": "textarea",
                    "rows": 6
                },
                "consent": {
                    "label": "I agree to the privacy policy and terms of service",
                    "required": True,
                    "type": "checkbox"
                }
            },
            "submitButton": {
                "text": "Send Message",
                "loadingText": "Sending...",
                "successText": "Message Sent!"
            },
            "messages": {
                "success": {
                    "title": "Message Sent Successfully!",
                    "description": "Thank you for contacting us. We'll get back to you within 24 hours."
                },
                "error": {
                    "title": "Oops! Something went wrong",
                    "description": "Please check your information and try again."
                }
            }
        },
        "contactInfo": {
            "title": "Contact Information",
            "subtitle": "Feel free to reach out through any of these channels. We're here to help!",
            "cards": [
                {
                    "id": 1,
                    "icon": "Mail",
                    "label": "Email Address",
                    "value": "contact@metechq.com",
                    "href": "mailto:contact@metechq.com",
                    "description": "Send us an email anytime"
                },
                {
                    "id": 2,
                    "icon": "Phone",
                    "label": "Phone Number",
                    "value": "+91 8328284501",
                    "href": "tel:+918328284501",
                    "description": "Available Mon-Sat, 9 AM - 6 PM"
                },
                {
                    "id": 3,
                    "icon": "Clock",
                    "label": "Business Hours",
                    "value": "Mon - Sat: 9 AM - 6 PM",
                    "description": "We typically respond within 24 hours"
                },
                {
                    "id": 4,
                    "icon": "MapPin",
                    "label": "Location",
                    "value": "India",
                    "description": "Serving clients worldwide"
                }
            ]
        },
        "businessHours": {
            "title": "Business Hours",
            "schedule": [
                {"day": "Monday - Friday", "hours": "9:00 AM - 6:00 PM", "available": True},
                {"day": "Saturday", "hours": "10:00 AM - 4:00 PM", "available": True},
                {"day": "Sunday", "hours": "Closed", "available": False}
            ],
            "timezone": "IST (Indian Standard Time)",
            "note": "We respond to all inquiries within 24 business hours"
        },
        "faq": {
            "title": "Frequently Asked Questions",
            "subtitle": "Quick answers to common questions about working with us",
            "questions": [
                {
                    "id": 1,
                    "question": "What is your typical response time?",
                    "answer": "We aim to respond to all inquiries within 24 business hours. For urgent matters, please mention it in your message and we'll prioritize accordingly."
                },
                {
                    "id": 2,
                    "question": "How long does a typical project take?",
                    "answer": "Project timelines vary based on complexity and scope. A simple website takes 2-3 weeks, while complex e-commerce or full-stack applications can take 6-12 weeks. We'll provide a detailed timeline after discussing your requirements."
                },
                {
                    "id": 3,
                    "question": "What is your pricing model?",
                    "answer": "We offer flexible pricing based on project requirements: fixed-price for well-defined projects, hourly rates for ongoing work, and retainer packages for long-term partnerships. We provide detailed quotes after understanding your needs."
                },
                {
                    "id": 4,
                    "question": "Do you provide support after project delivery?",
                    "answer": "Yes! All projects include 30 days of free post-launch support for bug fixes and minor adjustments. We also offer ongoing maintenance packages for continuous support, updates, and enhancements."
                },
                {
                    "id": 5,
                    "question": "Can you work with existing projects?",
                    "answer": "Absolutely! We can take over existing projects, add new features, fix issues, or provide consultation on improvements. We'll review your codebase and provide recommendations."
                }
            ]
        },
        "cta": {
            "title": "Ready to Start Your Project?",
            "subtitle": "Let's turn your vision into reality",
            "description": "Join 35+ satisfied clients who have transformed their businesses with our solutions",
            "primaryButton": {
                "text": "Request a Quote",
                "link": "#contact-form"
            },
            "secondaryButton": {
                "text": "View Portfolio",
                "link": "/portfolio"
            },
            "stats": [
                {"value": "35+", "label": "Happy Clients"},
                {"value": "50+", "label": "Projects Delivered"},
                {"value": "24hrs", "label": "Response Time"}
            ]
        }
    }
