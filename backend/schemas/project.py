from pydantic import BaseModel, field_validator
from urllib.parse import urlsplit
from typing import List, Optional

class ProjectLinkValidation(BaseModel):
    @field_validator('image_url', 'live_demo_url', 'github_url', 'demo_video_url', check_fields=False)
    @classmethod
    def validate_link(cls, value):
        if value is None or value == '':
            return value
        value = value.strip()
        if any(ord(char) < 32 for char in value) or '\\' in value:
            raise ValueError('Invalid URL characters')
        if value.startswith('/') and not value.startswith('//'):
            return value
        parsed = urlsplit(value)
        if parsed.scheme not in {'http', 'https'} or not parsed.hostname or parsed.username or parsed.password:
            raise ValueError('Use an http(s) website URL or a relative site path')
        return value

    @field_validator('gallery_images', check_fields=False)
    @classmethod
    def validate_gallery(cls, values):
        if values is None:
            return None
        return [cls.validate_link(value) for value in values]

class ProjectCreate(ProjectLinkValidation):
    title: str
    slug: Optional[str] = None
    category: str
    description: str
    image_url: str
    tech_stack: List[str] = []
    featured: bool = False
    is_private: bool = False
    live_demo_url: Optional[str] = None
    case_study_content: Optional[str] = None
    status: str = "completed"
    github_url: Optional[str] = None
    client_name: Optional[str] = None
    demo_video_url: Optional[str] = None
    gallery_images: Optional[List[str]] = []
    project_duration: Optional[str] = None
    team_size: Optional[str] = None
    key_features: Optional[List[str]] = []

class ProjectUpdate(ProjectLinkValidation):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    featured: Optional[bool] = None
    is_private: Optional[bool] = None
    live_demo_url: Optional[str] = None
    case_study_content: Optional[str] = None
    status: Optional[str] = None
    github_url: Optional[str] = None
    client_name: Optional[str] = None
    demo_video_url: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    project_duration: Optional[str] = None
    team_size: Optional[str] = None
    key_features: Optional[List[str]] = None

class ProjectResponse(BaseModel):
    id: str
    title: str
    slug: str
    category: str
    description: str
    image_url: str
    tech_stack: List[str]
    featured: bool
    is_private: bool
    live_demo_url: Optional[str] = None
    case_study_content: Optional[str] = None
    status: str
    github_url: Optional[str] = None
    client_name: Optional[str] = None
    demo_video_url: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    project_duration: Optional[str] = None
    team_size: Optional[str] = None
    key_features: Optional[List[str]] = None
