# Metechq Platform — Complete Codebase Audit

**Date**: November 6, 2026  
**Auditor**: Lead Software Architect, Senior Full-Stack Engineer, Application Security Engineer, QA & DevOps  
**Repository**: [mani1715/Metechq](https://github.com/mani1715/Metechq)  
**Branch**: `main`  

---

## 1. Executive Summary

This comprehensive audit evaluates the **Metechq** application (formerly MSPN DEV), a full-stack digital agency and client management platform. The application comprises a **FastAPI (Python 3.10+)** backend, a **React 18 (CRAC0 + Tailwind CSS)** frontend, and a **MongoDB** document database accessed asynchronously via the **Motor** driver.

The codebase features rich, mature domain logic including client project collaboration, milestone tracking, interactive customer chat, consultation bookings, analytics telemetry, portfolio showcases, and a multi-role administrative CMS. However, our rigorous static analysis and security verification revealed several **critical and high-severity security vulnerabilities**:
1. **Critical Authentication Bypass & Insecure Fallbacks**: A hardcoded JWT secret fallback (`your-secret-key-change-in-production`) in `backend/auth/jwt.py` allowing trivial token forgery if unset.
2. **Missing Authorization on Core Mutating Endpoints**: Routes for `/contacts/`, `/content/`, `/pages/`, `/projects/`, `/services/`, and `/settings/` lack authentication dependencies, permitting unauthenticated public visitors to modify, overwrite, or delete platform data.
3. **Unrestricted File Upload**: File endpoints in `storage.py` and `admin_client_projects.py` permit uploading files without extension whitelisting, MIME type verification, or file size limits.
4. **Information Disclosure & IDOR**: The customer chat endpoint (`/chat/user-conversation`) exposes all private conversation transcripts to anyone possessing an email address without authentication.
5. **Runtime Defects & Broken Deployment Artifacts**: `backend/Dockerfile` executes `python app.py` (which does not exist; the entry point is `server.py`). The credentials router expects an `Admin` Pydantic model from `get_current_admin` but receives a `dict`, causing runtime 500 errors.

This document establishes the verified baseline of the codebase across architecture, routing, data models, frontend components, and deployment pipelines.

---

## 2. Architecture & Technology Stack

| Layer | Technologies & Libraries | Verified Status |
| :--- | :--- | :--- |
| **Backend Framework** | FastAPI 0.110.1, Starlette 0.37.2, Uvicorn 0.25.0 | Verified (`backend/server.py`) |
| **Language & Runtime** | Python 3.10+ (`.python-version`: 3.10) | Verified |
| **Database** | MongoDB 6.0+ via Motor 3.3.1 (AsyncIO) & PyMongo 4.5.0 | Verified (`backend/database.py`) |
| **Authentication** | PyJWT 2.10.1 (HS256), BCrypt 4.1.3, Passlib 1.7.4 | Verified (`backend/auth/`) |
| **Validation / Typing**| Pydantic v2 (2.12.5), Pydantic Core 2.41.5 | Verified (`backend/schemas/`, `models/`) |
| **Frontend Framework** | React 18.2.0, React DOM 18.2.0, React Router DOM 6.22.0 | Verified (`frontend/package.json`) |
| **Styling & UI** | Tailwind CSS 3.4.1, Lucide React 0.344.0, Sonner 1.4.3 | Verified (`frontend/tailwind.config.js`) |
| **Build Tooling** | CRACO 7.1.0, Webpack Dev Server, PostCSS, Autoprefixer | Verified (`frontend/craco.config.js`) |
| **Deployment / Infra** | Docker (python:3.10-slim), Vercel configuration (`vercel.json`) | Verified (`backend/Dockerfile`) |

---

## 3. Entry Points & Lifecycles

### 3.1 Backend Entry Point (`backend/server.py`)
- **Initialization**: Creates `FastAPI` instance with title `"METECHQ API"`, sets up `ProxyHeaderMiddleware` to capture `X-Forwarded-Proto` and `X-Forwarded-Host`.
- **CORS Configuration**: Configures `starlette.middleware.cors.CORSMiddleware` using `ALLOWED_ORIGINS` combined with comma-separated values from `CORS_ORIGINS` environment variable.
- **Router Ingestion**: Mounts 26 distinct APIRouter modules under `/api` root prefix.
- **Startup Lifecycle**: `@app.on_event("startup")` invokes `auto_initialize_database()` in `auto_init.py`, automatically seeding default portfolio projects and services if database collections are empty.
- **Shutdown Lifecycle**: Exposes `close_db_connection()` to close the Motor MongoDB connection pool cleanly.

### 3.2 Frontend Entry Point (`frontend/src/index.js`, `frontend/src/App.js`)
- **Root Setup**: Renders inside `<React.StrictMode>`, wrapping `<App>` with `<BrowserRouter>` configured with React Router v7 future flags (`v7_startTransition`, `v7_relativeSplatPath`).
- **Context Providers**:
  - `AdminProvider` (`frontend/src/admin/context/AdminContext.jsx`): Manages admin authentication state, admin user profile, and high-level CRUD mutations.
  - `CartProvider` (`frontend/src/context/CartContext.jsx`): Supports e-commerce demo shopping cart state.
- **Routing Boundaries**:
  - Public routes: `/`, `/about`, `/services`, `/portfolio`, `/portfolio/:id`, `/contact`, `/chat`, `/blogs`, `/blogs/:slug`, `/submit-testimonial`.
  - Client Portal: `/client/login`, `/client/dashboard`.
  - Admin Console: `/admin/login`, `/admin/*` protected by `AdminLayout` route guard.
  - Interactive Demos: 10 live industry interactive demo routes under `/demo/*`.

---

## 4. API Routers & Endpoints Inventory

The backend organizes 143 endpoints across 26 route files:

| Router Module | Route Prefix | Endpoints | Intended Access Level | Observed Authorization Defect |
| :--- | :--- | :--- | :--- | :--- |
| `about.py` | `/api/about` | 2 | Public (GET), Admin (PUT) | Correctly enforced via `Depends(get_current_admin)` on PUT |
| `admins.py` | `/api/admins` | 7 | Public (Login, Init), Super Admin | `/init` hardcodes default password `"admin123"` |
| `admin_clients.py` | `/api/admin/clients` | 5 | Admin only | Correctly enforced via `Depends(get_current_admin)` |
| `admin_client_projects.py` | `/api/admin/client-projects` | 21 | Admin only | File upload lacks MIME/extension/size verification |
| `analytics.py` | `/api/analytics` | 2 | Public (Event), Admin (Summary) | Properly configured |
| `auth.py` | `/api/auth` | 3 | Public (Register, Login, Logout) | **CRITICAL**: `/register` is unauthenticated; allows registering arbitrary admin accounts |
| `blogs.py` | `/api/blogs` | 6 | Public (GET), Admin (CRUD) | Correctly separated |
| `bookings.py` | `/api/bookings` | 9 | Public (Slot/Create), Admin (CRUD) | Correctly separated |
| `booking_settings.py` | `/api/booking-settings` | 5 | Public (GET), Admin (CRUD) | Correctly separated |
| `chat.py` | `/api/chat` | 7 | Public (Message/Get), Admin (Manage) | **HIGH**: `/user-conversation` leaks chat transcripts by email query alone |
| `client_auth.py` | `/api/client/auth` | 6 | Public (Login, Logout), Client (Me) | Correctly checks `payload.get('type') == 'client'` |
| `client_projects.py` | `/api/client/projects` | 6 | Client only | Validates `client_id == client['id']` |
| `contact_page.py` | `/api/contact-page` | 3 | Public (GET), Admin (PUT, Reset) | Correctly enforced |
| `contacts.py` | `/api/contacts` | 6 | Public (POST), Admin (GET, PUT, DEL) | **CRITICAL**: Admin routes (`/admin/all`, `GET/PUT/DELETE /{id}`) lack auth dependency entirely |
| `content.py` | `/api/content` | 2 | Public (GET), Admin (PUT) | **HIGH**: `PUT /` has no auth dependency |
| `credentials.py` | `/api/credentials` | 6 | Admin / Super Admin | **MEDIUM**: Unhandled AttributeError (`current_admin.role` on dict) |
| `newsletter.py` | `/api/newsletter` | 4 | Public (Sub), Admin (CRUD, Export) | Correctly enforced |
| `notes.py` | `/api/notes` | 5 | Admin only | **MEDIUM**: ReDoS vulnerability in unescaped regex search |
| `pages.py` | `/api/pages` | 3 | Public (GET), Admin (POST, PUT) | **HIGH**: `PUT /{page_name}` and `POST /` have no auth dependency |
| `pricing.py` | `/api/pricing` | 2 | Public (GET), Admin (PUT) | Correctly enforced |
| `projects.py` | `/api/projects` | 6 | Public (GET), Admin (CRUD) | **HIGH**: `POST /`, `PUT /{id}`, `DELETE /{id}` have no auth dependency |
| `services.py` | `/api/services` | 5 | Public (GET), Admin (CRUD) | **HIGH**: `POST /`, `PUT /{id}`, `DELETE /{id}` have no auth dependency |
| `settings.py` | `/api/settings` | 2 | Public (GET), Admin (PUT) | **HIGH**: `PUT /` has no auth dependency |
| `skills.py` | `/api/skills` | 4 | Public (GET), Admin (CRUD) | Correctly enforced |
| `storage.py` | `/api/storage` | 5 | Admin only | **HIGH**: Unrestricted upload, `/app/public/uploads` path traversal risk |
| `testimonials.py` | `/api/testimonials` | 10 | Public, Client, Admin | Verified client checks; admin operations properly guarded |

---

## 5. Database Schema & Data Models

### 5.1 Collections Overview
The MongoDB database (`mspn_dev_db` or configured `DB_NAME`) utilizes 22 active collections:
1. `admins`: Admin user accounts with hashed credentials and granular permission flags (`AdminPermissions`).
2. `clients`: Client portal accounts with hashed credentials and active state.
3. `client_projects`: Complex hierarchical project management documents containing milestones, tasks, files, comments, chat messages, activity logs, budget, and team assignments.
4. `users`: Legacy user collection created by `/auth/register`.
5. `projects`: Public portfolio projects with slugs, tags, status, and demo URLs.
6. `services`: Digital agency service offerings, pricing tiers, and features.
7. `testimonials`: Customer reviews, ratings, approval statuses (`pending`, `approved`, `rejected`), and verification tags.
8. `blogs`: Articles, content blocks, publication statuses, tags, and SEO metadata.
9. `contacts`: Public inbound contact form submissions with read/unread statuses.
10. `conversations`: Customer live chat sessions and message histories.
11. `bookings`: Scheduled consultation sessions with calendar slots and status.
12. `booking_settings`: Availability schedules, business hours, and buffer times.
13. `settings`: Global agency metadata, brand assets, social links, and theme configuration.
14. `about_content`: Long-form company history, team members, core values, achievements.
15. `contact_page`: Contact page specific layouts, office hours, and custom coordinates.
16. `content`: High-level landing page banner and section copies.
17. `page_content`: Dynamic section key-value storage by page name.
18. `storage`: Administrative files, notes, metadata, and visibility scopes.
19. `notes`: Administrative scratchpad notes with tags.
20. `skills`: Agency technical skill tags and proficiency levels.
21. `newsletter`: Email subscriber list and statuses.
22. `analytics`: Telemetry events, page views, and calculator conversions.

### 5.2 Query Patterns & Optimization Gaps
- **Missing Database Indexes**: Queries perform lookups by `id`, `slug`, `client_id`, `created_at`, `status`, and `customer_email`. However, no explicit indexes are defined in code or created during startup, leading to collection scans on large datasets.
- **Unbounded Queries**: Endpoints like `GET /contacts/admin/all`, `GET /storage/items`, `GET /newsletter/admin/all` query collections with `.to_list(length=1000)` or `10000` without pagination (`limit`, `skip`), exposing the server to memory pressure under volume.

---

## 6. Frontend Architecture & Quality

### 6.1 State Management & Routing
- Frontend routes are cleanly organized in `App.js`.
- Admin console components utilize `AdminContext` for shared state and API communication.
- Client Dashboard (`ClientDashboard.jsx`) functions autonomously using `clientService.js` and local component state, maintaining clean separation between administrative CMS and client collaboration.

### 6.2 Token Management & Session Lifecycles
- `authService.js` stores `admin_token` and `admin_user` in browser `localStorage`.
- `clientService.js` and `ClientLogin.jsx` store `client_token` and `client_data` in browser `localStorage`.
- In `frontend/src/services/api.js`:
  - The request interceptor looks for `admin_token` first, falling back to `client_token`. If both are present in `localStorage`, the admin token is inadvertently sent to client routes.
  - The response interceptor automatically redirects to `/admin/login` on any 401 response, disrupting client users who should be directed to `/client/login`.

---

## 7. Build, Deployment & DevOps Status

### 7.1 Backend Dockerfile
`backend/Dockerfile` contains a fatal misconfiguration:
```dockerfile
CMD ["python", "app.py"]
```
There is no `app.py` in the backend. The correct entry point is `uvicorn server:app --host 0.0.0.0 --port 8000`.

### 7.2 Docker Compose
No top-level or backend `docker-compose.yml` was provided, preventing developers or operators from spinning up backend, frontend, and MongoDB services in a single, reproducible local or staging command.

### 7.3 Frontend Build
The frontend uses CRACO (`frontend/craco.config.js`). Recent cleanup removed broken custom Babel plugins (`plugins/visual-edits/`), allowing Webpack to compile without errors on Node 18/20.

---

## 8. Summary of Findings Matrix

| Finding Category | Critical | High | Medium | Low | Total |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Authentication & Secrets** | 2 | 1 | 0 | 1 | 4 |
| **Authorization & IDOR** | 1 | 6 | 1 | 0 | 8 |
| **File Security** | 1 | 1 | 0 | 0 | 2 |
| **Database & Queries** | 0 | 0 | 2 | 1 | 3 |
| **API & Configuration** | 0 | 1 | 2 | 1 | 4 |
| **Frontend & Session** | 0 | 0 | 2 | 1 | 3 |
| **DevOps & Packaging** | 0 | 1 | 1 | 0 | 2 |
| **Total** | **4** | **10** | **8** | **4** | **26** |

The granular details, proof-of-concept evidence, and corrective remediation steps for each vulnerability are cataloged in `docs/SECURITY_FINDINGS.md`.
