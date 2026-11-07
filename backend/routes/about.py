from auth.admin_auth import require_permission
from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional
from schemas.about import AboutContentUpdate, AboutContentResponse
from database import db
from auth.admin_auth import get_current_admin
from models.about import AboutContent
from datetime import datetime
import uuid

router = APIRouter(prefix="/about", tags=["about"])

# Collection
about_collection = db['about_content']

@router.get("/", response_model=AboutContentResponse)
async def get_about_content():
    """Get About page content"""
    # Get the about content (should only be one document)
    about_doc = await about_collection.find_one({})
    
    if not about_doc:
        # Return default content if none exists
        return get_default_about_content()
    
    # Remove MongoDB _id field
    about_doc.pop('_id', None)
    return AboutContentResponse(**about_doc)

@router.put("/", response_model=AboutContentResponse)
async def update_about_content(
    content: AboutContentUpdate,
    current_admin: dict = Depends(require_permission("canManageAbout"))
):
    """Update About page content (admin only)"""
    
    try:
        # Check if content exists
        existing = await about_collection.find_one({})
        
        # Prepare update data - properly handle nested objects
        content_dict = content.model_dump(exclude_unset=False)
        content_dict['updated_at'] = datetime.utcnow().isoformat()
        content_dict['updated_by'] = current_admin['username']
        
        # Ensure values and achievements are properly formatted with unique IDs
        if 'values' in content_dict:
            values_list = []
            for v in content_dict['values']:
                v_dict = dict(v) if not isinstance(v, dict) else v
                # Ensure each value has a unique ID
                if not v_dict.get('id') or v_dict.get('id') is None:
                    v_dict['id'] = str(uuid.uuid4())
                values_list.append(v_dict)
            content_dict['values'] = values_list
        
        if 'achievements' in content_dict:
            achievements_list = []
            for a in content_dict['achievements']:
                a_dict = dict(a) if not isinstance(a, dict) else a
                # Ensure each achievement has a unique ID
                if not a_dict.get('id') or a_dict.get('id') is None:
                    a_dict['id'] = str(uuid.uuid4())
                achievements_list.append(a_dict)
            content_dict['achievements'] = achievements_list
        
        if existing:
            # Update existing content
            content_dict['id'] = existing['id']
            await about_collection.replace_one(
                {"id": existing['id']},
                content_dict
            )
        else:
            # Create new content
            content_dict['id'] = str(uuid.uuid4())
            await about_collection.insert_one(content_dict)
        
        # Return updated content
        content_dict.pop('_id', None)
        return AboutContentResponse(**content_dict)
    except Exception as e:
        import traceback
        print(f"Error updating about content: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating about content: {str(e)}"
        )

@router.post("/init")
async def initialize_about_content(current_admin: dict = Depends(require_permission("canManageAbout"))):
    """Initialize About content with defaults (admin only)"""
    existing = await about_collection.find_one({})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="About content already exists"
        )
    
    default_content = get_default_about_content()
    content_dict = default_content.model_dump()
    content_dict['updated_by'] = current_admin['username']
    
    await about_collection.insert_one(content_dict)
    
    content_dict.pop('_id', None)
    return AboutContentResponse(**content_dict)

def get_default_about_content() -> AboutContentResponse:
    """Get default About page content"""
    return AboutContentResponse(
        id=str(uuid.uuid4()),
        hero_title="About METECHQ",
        hero_subtitle="Crafting Digital Excellence Through Innovation & Precision",
        hero_description="Building exceptional digital experiences that transform businesses and delight users worldwide.",
        hero_badge="Premium Web Development Agency",
        story_title="Our Story",
        story_paragraphs=[
            "Founded by Maneesh, a passionate and skilled full-stack developer, METECHQ was born from a vision to help businesses thrive in the digital age. With expertise spanning across HTML, CSS, JavaScript, and modern frameworks, we bring ideas to life with precision and creativity.",
            "At METECHQ, we specialize in full-stack development, creating custom websites and e-commerce platforms that don't just look beautiful—they perform exceptionally. Every project is approached with meticulous attention to detail, ensuring seamless user experiences and robust functionality.",
            "Our journey is defined by continuous learning, adopting cutting-edge technologies, and delivering solutions that exceed expectations. From sleek corporate websites to complex web applications, we transform visions into powerful digital realities."
        ],
        story_expertise=[
            "Full-Stack Web Development",
            "Custom Website Design & Development",
            "E-commerce Website Solutions",
            "Responsive & Mobile-First Design",
            "API Development & Integration",
            "Performance Optimization"
        ],
        values_badge="Our Values",
        values_title="Principles That Drive Us",
        values_description="The core values that guide every project and client relationship",
        values=[
            {
                "id": str(uuid.uuid4()),
                "icon": "Award",
                "title": "Excellence",
                "description": "We strive for excellence in every line of code, every design decision, and every client interaction. Quality is never compromised, and every project reflects our commitment to perfection."
            },
            {
                "id": str(uuid.uuid4()),
                "icon": "Target",
                "title": "Innovation",
                "description": "Staying ahead of technology trends and implementing cutting-edge solutions that give our clients a competitive advantage. We embrace new technologies and methodologies to deliver modern solutions."
            },
            {
                "id": str(uuid.uuid4()),
                "icon": "Zap",
                "title": "Efficiency",
                "description": "Delivering projects on time without sacrificing quality. We value your time and ensure smooth, efficient project execution with clear communication and agile methodologies."
            },
            {
                "id": str(uuid.uuid4()),
                "icon": "Shield",
                "title": "Transparency",
                "description": "Open communication and honesty in every interaction. We believe in building trust through transparency, keeping you informed at every stage of the development process."
            }
        ],
        achievements_badge="Achievements",
        achievements_title="Numbers That Speak",
        achievements=[
            {
                "id": str(uuid.uuid4()),
                "icon": "Briefcase",
                "value": "50+",
                "label": "Projects Completed"
            },
            {
                "id": str(uuid.uuid4()),
                "icon": "Users",
                "value": "35+",
                "label": "Happy Clients"
            },
            {
                "id": str(uuid.uuid4()),
                "icon": "TrendingUp",
                "value": "3+",
                "label": "Years Experience"
            },
            {
                "id": str(uuid.uuid4()),
                "icon": "Layers",
                "value": "10+",
                "label": "Technologies"
            }
        ],
        founder_badge="Meet the Founder",
        founder_title="The Mind Behind METECHQ",
        founder_name="Maneesh",
        founder_role="Full-Stack Developer & Founder",
        founder_bio="With a passion for creating seamless digital experiences, Maneesh brings years of expertise in full-stack development, specializing in modern web technologies. His commitment to excellence and innovation drives METECHQ to deliver exceptional results for every client.",
        founder_skills=[
            "HTML, CSS, JavaScript",
            "React & Node.js",
            "Full-Stack Development",
            "E-commerce Solutions",
            "API Development",
            "Database Design"
        ],
        founder_show_image=False,
        founder_image_url=None,
        cta_title="Ready to Start Your Project?",
        cta_description="Let's collaborate to bring your vision to life. Get in touch today and let's build something amazing together.",
        cta_button_text="Get In Touch",
        cta_button_link="/contact",
        updated_at=datetime.utcnow().isoformat(),
        updated_by="system"
    )
