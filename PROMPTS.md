# 📋 METECHQ Engineering Directives & System Audit Prompts (PROMPTS.md)

This document catalogs the engineering specifications, discovery prompts, security hardening directives, and quality assurance workflows utilized during the comprehensive audit and production upgrade of the **METECHQ** platform.

---

## 1. Architectural Discovery & Codebase Inspection Prompts

### Discovery Prompt: Full System Inventory
```text
Inspect the repository structure, identifying:
1. Entry points for frontend (React 18 / CRACO) and backend (FastAPI / Uvicorn).
2. All 26 API router modules, cataloging all 143 endpoints with their methods, URL paths, and auth dependencies.
3. Database schemas and models in MongoDB/Motor.
4. File storage workflows and static asset handling.
5. All client pages, admin dashboard modules, and interactive showcases.
6. Environmental variables, Docker configuration, and test suites.
Document findings into docs/COMPLETE_CODEBASE_AUDIT.md and docs/FEATURE_INVENTORY.md.
```

---

## 2. Security Hardening Directives

### Phase 1: Secrets & Configuration Hardening
```text
1. Audit backend/auth/jwt.py, backend/server.py, and backend/config.py for fallback secrets and hardcoded credentials.
2. Remove hardcoded fallback secret strings.
3. Implement validate_config() in backend/config.py to enforce minimum 32-character keys and reject production startup if default secrets are detected.
4. Update root .gitignore to ignore all variations of .env and upload directories.
5. Provide sanitized .env.example templates containing placeholder values only.
```

### Phase 2: Authentication & Brute-Force Defense
```text
1. Inspect admin and client authentication flows in backend/routes/admins.py, backend/routes/client_auth.py, and backend/routes/auth.py.
2. Implement password complexity validation (min 8 chars, uppercase, lowercase, number, special character) in backend/auth/password.py.
3. Lock down public user registration (/api/auth/register) to require superadmin authorization.
4. Construct an in-memory sliding-window rate limiter (backend/utils/rate_limiter.py) and apply 5-attempt/5-minute limits to admin and client login endpoints.
```

### Phase 3: Authorization & IDOR Elimination
```text
Review every endpoint in backend/routes:
1. Identify any data-mutation routes (POST, PUT, DELETE) or sensitive data query routes missing Depends(get_current_admin).
2. Secure contacts.py, content.py, pages.py, projects.py, services.py, and settings.py against unauthenticated modifications.
3. Fix dictionary vs Pydantic model attribute access in backend/routes/credentials.py.
4. Ensure client portal routes strictly enforce tenant isolation by verifying client_id on all project and task operations.
```

### Phase 4: File Upload & Storage Security
```text
1. Create backend/utils/file_security.py implementing:
   - File extension allowlisting and executable denylisting.
   - Magic byte header signature inspection (JPEG, PNG, WebP, PDF, ZIP).
   - SVG sanitization (blocking embedded <script>, javascript: handlers, and onload= attributes).
   - Maximum file size enforcement (15MB limit).
   - Path traversal prevention via filename sanitization and UUID generation.
2. Update backend/routes/storage.py and backend/routes/admin_client_projects.py to use cross-platform UPLOAD_DIR and authenticated download endpoints.
```

### Phase 5 & 6: Database Security & Defense-in-Depth Middleware
```text
1. Protect MongoDB regex queries in backend/routes/notes.py from ReDoS by wrapping query terms in re.escape().
2. Add automated startup database indexing (init_db_indexes) in backend/database.py.
3. Add SecurityHeadersMiddleware to FastAPI server in backend/server.py, enforcing X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN, and Referrer-Policy.
```

---

## 3. Automated Testing Directives

### Comprehensive Security Test Suite Creation
```text
Create automated pytest test suite in tests/backend/test_comprehensive_security.py using httpx.AsyncClient to verify:
1. API health root endpoint.
2. Public read-only endpoints (projects, services, about, settings).
3. Security headers on all HTTP responses.
4. 401 Unauthorized rejection on unauthenticated contact deletion, content update, pages update, project creation, service creation, settings update, and registration.
5. 401 Unauthorized rejection of invalid login credentials.
6. Rate limiting on rapid failed login attempts.
7. File upload rejection for disallowed extensions (.exe) and malicious SVG scripts.
8. Authenticated admin operations and audit log querying.
```

---

## 4. Production Packaging Directives

### Docker & CI/CD Pipeline
```text
1. Correct backend/Dockerfile entrypoint to run uvicorn server:app with Docker healthcheck.
2. Create frontend/Dockerfile with multi-stage build (Node 18 builder + Nginx Alpine runner) and frontend/nginx.conf.
3. Create root docker-compose.yml orchestrating MongoDB 6.0, FastAPI backend, and React frontend with health dependencies and named volumes.
4. Create GitHub Actions CI workflow in .github/workflows/ci.yml running pytest security tests and frontend production build.
```
