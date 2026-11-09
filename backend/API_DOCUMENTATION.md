# METECHQ API Documentation

## Base URL
```
http://localhost:8001/api
```

## Authentication

All admin endpoints (except login) require JWT authentication.

Add the token to requests:
```
Authorization: Bearer <access_token>
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@metechq.com",
  "password": "<your-secure-password>"
}

Response:
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@metechq.com",
    "role": "admin"
  }
}
```

### Logout
```http
POST /api/auth/logout
```

## Services

### Get All Services
```http
GET /api/services/

Response:
[
  {
    "id": "uuid",
    "title": "Web Development",
    "description": "Custom websites...",
    "icon": "Code",
    "features": ["Feature 1", "Feature 2"],
    "price": "Starting at $2,999",
    "active": true,
    "order": 1
  }
]
```

### Get Service by ID
```http
GET /api/services/{service_id}
```

### Create Service
```http
POST /api/services/
Content-Type: application/json

{
  "title": "Service Title",
  "description": "Service description",
  "icon": "Code",
  "features": ["Feature 1", "Feature 2"],
  "price": "Starting at $2,999",
  "active": true,
  "order": 1
}
```

### Update Service
```http
PUT /api/services/{service_id}
Content-Type: application/json

{
  "title": "Updated Title",
  "active": false
}
```

### Delete Service
```http
DELETE /api/services/{service_id}
```

## Projects

### Get All Projects
```http
GET /api/projects/

Response:
[
  {
    "id": "uuid",
    "title": "E-commerce Platform",
    "slug": "ecommerce-platform",
    "category": "E-commerce",
    "description": "A modern e-commerce...",
    "image_url": "https://...",
    "tech_stack": ["React", "Node.js"],
    "featured": true,
    "live_demo_url": "/demo/ecommerce",
    "case_study_content": "...",
    "status": "completed"
  }
]
```

### Get Project by ID
```http
GET /api/projects/{project_id}
```

### Create Project
```http
POST /api/projects/
Content-Type: application/json

{
  "title": "Project Title",
  "category": "E-commerce",
  "description": "Project description",
  "image_url": "https://...",
  "tech_stack": ["React", "Node.js"],
  "featured": false,
  "live_demo_url": "/demo/project",
  "status": "completed"
}
```

### Update Project
```http
PUT /api/projects/{project_id}
Content-Type: application/json

{
  "title": "Updated Title",
  "featured": true
}
```

### Delete Project
```http
DELETE /api/projects/{project_id}
```

## Contacts

### Submit Contact Form (Public)
```http
POST /api/contacts/
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "service": "Web Development",
  "message": "I need a website"
}

Response:
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "service": "Web Development",
  "message": "I need a website",
  "read": false,
  "created_at": "2025-12-14T10:00:00"
}
```

### Get All Contacts (Admin)
```http
GET /api/contacts/admin/all

Response:
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "service": "Web Development",
    "message": "I need a website",
    "read": false,
    "created_at": "2025-12-14T10:00:00"
  }
]
```

### Mark Contact as Read
```http
PATCH /api/contacts/{contact_id}/read
Content-Type: application/json

{
  "read": true
}
```

### Delete Contact
```http
DELETE /api/contacts/{contact_id}
```

## Pages

### Get Page Content
```http
GET /api/pages/{page_name}

Example: GET /api/pages/home

Response:
{
  "hero": {
    "badge": "Professional Web Development",
    "headline": "Building Digital Excellence",
    "description": "...",
    "cta1Text": "View Portfolio"
  },
  "stats": {
    "visible": true,
    "stat1": "10+",
    "stat1Label": "Projects Completed"
  }
}
```

### Update Page Content
```http
PUT /api/pages/{page_name}
Content-Type: application/json

{
  "hero": {
    "headline": "New Headline",
    "description": "New description"
  },
  "stats": {
    "visible": false
  }
}
```

## Settings

### Get Settings
```http
GET /api/settings/

Response:
{
  "id": "global_settings",
  "agency_name": "METECHQ",
  "owner_name": "Maneesh",
  "email": "info@metechq.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "description": "...",
  "tagline": "...",
  "social_links": {
    "facebook": "https://...",
    "twitter": "https://..."
  },
  "theme": {
    "primary": "#1C2A3A",
    "secondary": "#D4AF37"
  }
}
```

### Update Settings
```http
PUT /api/settings/
Content-Type: application/json

{
  "agency_name": "New Name",
  "email": "newemail@example.com",
  "social_links": {
    "facebook": "https://new-url"
  }
}
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

Error Response Format:
```json
{
  "detail": "Error message here"
}
```

## Testing with cURL

### Login and Save Token
```bash
TOKEN=$(curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@metechq.com","password":"<your-secure-password>"}' \
  | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
```

### Use Token for Authenticated Request
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8001/api/services/
```

## Database Collections

- **users** - Admin users
- **services** - Service offerings
- **projects** - Portfolio projects
- **contacts** - Contact form submissions
- **page_content** - Page content sections
- **settings** - Global settings

## Notes

- All timestamps are in ISO 8601 format
- UUIDs are used for all IDs (not MongoDB ObjectIds)
- Passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- CORS is enabled for all origins (configure in production)
