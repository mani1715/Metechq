# Metechq Platform — Security Audit & Findings Log

**Date**: November 6, 2026  
**Status**: Confirmed & Documented Baseline  
**Scope**: Full Stack (FastAPI, React, MongoDB, System Environment, Infrastructure)  

---

## 1. Vulnerability Findings Matrix

| Finding ID | Severity | Category | File & Location | Summary |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **CRITICAL** | Auth / Secrets | `backend/auth/jwt.py:6` | Hardcoded Fallback JWT Secret Key |
| **SEC-02** | **CRITICAL** | Authorization | `backend/routes/contacts.py:21-87` | Missing Auth on Inbound Contact Viewing, Editing & Deletion |
| **SEC-03** | **CRITICAL** | Auth / PrivEsc | `backend/routes/auth.py:10-39` | Unprotected User Registration Allowing Arbitrary Role Escalation |
| **SEC-04** | **CRITICAL** | File Security | `backend/routes/storage.py:160-192` | Unrestricted Arbitrary File Upload (No MIME/Ext/Size Checks) |
| **SEC-05** | **HIGH** | Authorization | `backend/routes/content.py:26` | Unauthenticated Global Website Content Modification |
| **SEC-06** | **HIGH** | Authorization | `backend/routes/pages.py:26, 59` | Unauthenticated Page Content Creation & Modification |
| **SEC-07** | **HIGH** | Authorization | `backend/routes/projects.py:38, 53, 81` | Unauthenticated Project Creation, Modification & Deletion |
| **SEC-08** | **HIGH** | Authorization | `backend/routes/services.py:30, 41, 64` | Unauthenticated Service Creation, Modification & Deletion |
| **SEC-09** | **HIGH** | Authorization | `backend/routes/settings.py:30` | Unauthenticated Agency Settings Modification |
| **SEC-10** | **HIGH** | Info Disclosure | `backend/routes/chat.py:96-120` | Unauthenticated Customer Chat Transcript Enumeration by Email |
| **SEC-11** | **HIGH** | File Security | `backend/routes/admin_client_projects.py:760-805` | Project File Upload Missing Extension & MIME Validation |
| **SEC-12** | **HIGH** | Auth / Secrets | `backend/routes/admins.py:78` | Default Hardcoded Password in Super Admin Initialization |
| **SEC-13** | **HIGH** | File Security | `backend/routes/storage.py:15` | Hardcoded Linux Upload Path (`/app/public/uploads`) |
| **SEC-14** | **HIGH** | DevOps | `backend/Dockerfile:10` | Broken Container Command (`python app.py`) |
| **SEC-15** | **MEDIUM** | Runtime Error | `backend/routes/credentials.py:26, 30` | Type Mismatch in Admin Dependency (`current_admin.role` on dict) |
| **SEC-16** | **MEDIUM** | Injection / ReDoS | `backend/routes/notes.py:25-27` | Unescaped User Regex in MongoDB Search Queries |
| **SEC-17** | **MEDIUM** | Session / Frontend | `frontend/src/services/api.js:44-50, 92-95` | Token Priority Collision and Global 401 Admin Redirect |
| **SEC-18** | **MEDIUM** | Rate Limiting | `backend/routes/admins.py:12`, `client_auth.py:12` | Absence of Brute-Force Rate Limiting on Login Endpoints |
| **SEC-19** | **MEDIUM** | Auditability | Backend Routes (All) | Missing Structured Security Audit Logging |
| **SEC-20** | **LOW** | Database / Perf | `backend/database.py:69-90` | Missing MongoDB Indexes on Foreign Keys and Query Selectors |

---

## 2. Granular Security Findings

### SEC-01: Hardcoded Fallback JWT Secret Key
- **Severity**: **CRITICAL** (CVSS 9.8)
- **File**: `backend/auth/jwt.py` (Line 6) and `backend/.env.example` (Line 33)
- **Description**: If the `JWT_SECRET_KEY` environment variable is not supplied, the application defaults to a publicly known static string. An attacker aware of this fallback can independently sign their own JWT with `{"id": "...", "role": "super_admin"}` and gain full super-admin access to the API without authenticating.
- **Actual Evidence**:
  ```python
  # backend/auth/jwt.py:6
  SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
  ```
- **Recommended Correction**: Require `JWT_SECRET_KEY` to be present and non-empty during startup. If missing or equal to the insecure placeholder in non-testing environments, fail backend initialization with an explicit error.
- **Verification Method**: Test token generation with an invalid key, verify that omitting `JWT_SECRET_KEY` refuses to boot in production mode, and verify that forged tokens signed with the placeholder are rejected.

---

### SEC-02: Public Unauthenticated Contact Modification & Deletion
- **Severity**: **CRITICAL** (CVSS 9.1)
- **File**: `backend/routes/contacts.py` (Lines 21-87)
- **Description**: Although `GET /contacts/admin/all` includes the comment `"""Get all contact submissions (admin only)"""`, no `Depends(get_current_admin)` or authentication check was applied. Furthermore, `GET /{contact_id}`, `PATCH /{contact_id}/read`, `PUT /{contact_id}`, and `DELETE /{contact_id}` are completely unauthenticated. Any anonymous visitor can read all private user contact details (names, emails, phones, messages) or purge the entire database of submissions.
- **Actual Evidence**:
  ```python
  # backend/routes/contacts.py:21-26
  @router.get("/admin/all", response_model=List[ContactResponse])
  async def get_all_contacts():
      cursor = contacts_collection.find().sort("created_at", -1)
      ...
  
  # backend/routes/contacts.py:77-80
  @router.delete("/{contact_id}")
  async def delete_contact(contact_id: str):
      result = await contacts_collection.delete_one({"id": contact_id})
  ```
- **Recommended Correction**: Attach `current_admin: dict = Depends(get_current_admin)` to `/admin/all` and all mutating endpoints (`PATCH`, `PUT`, `DELETE`). Only `POST /` (submitting a contact message) should remain public.
- **Verification Method**: Execute automated HTTP tests attempting unauthenticated GET, PUT, and DELETE against `/contacts/admin/all` and verify `401 Unauthorized`.

---

### SEC-03: Unprotected Registration Allowing Role Escalation
- **Severity**: **CRITICAL** (CVSS 9.8)
- **File**: `backend/routes/auth.py` (Lines 10-40)
- **Description**: The `/auth/register` endpoint accepts a `UserCreate` payload containing `name`, `email`, `password`, and `role`. It requires no authentication or admin secret. An external attacker can post `role: "super_admin"` or `role: "admin"` and instantiate privileged user accounts directly.
- **Actual Evidence**:
  ```python
  # backend/routes/auth.py:10-27
  @router.post("/register", response_model=UserResponse)
  async def register(user_data: UserCreate):
      """Register a new user (admin only endpoint in production)"""
      existing_user = await users_collection.find_one({"email": user_data.email})
      if existing_user:
          raise HTTPException(status_code=400, detail="Email already registered")
      user = User(
          name=user_data.name,
          email=user_data.email,
          password_hash=hash_password(user_data.password),
          role=user_data.role
      )
  ```
- **Recommended Correction**: Restrict `/auth/register` to authenticated super admins (`Depends(require_super_admin)`) or disable self-registration altogether. Ensure client creation is restricted to `/admin/clients/` and admin creation to `/admins/create`.
- **Verification Method**: Send an unauthenticated POST request to `/api/auth/register`; verify `401 Unauthorized` or `403 Forbidden`.

---

### SEC-04: Arbitrary File Upload Without Content Validation
- **Severity**: **CRITICAL** (CVSS 9.0)
- **File**: `backend/routes/storage.py` (Lines 160-192)
- **Description**: The `/storage/upload` endpoint takes an `UploadFile` without validating allowed extensions (permitting `.exe`, `.html`, `.svg`, `.php`), without inspecting MIME magic headers, and without checking file size. If served statically, this enables Stored Cross-Site Scripting (XSS), server resource exhaustion, and remote payload execution.
- **Actual Evidence**:
  ```python
  # backend/routes/storage.py:175-181
  file_extension = os.path.splitext(file.filename)[1]
  unique_filename = f"{uuid.uuid4()}{file_extension}"
  file_path = UPLOAD_DIR / unique_filename
  with open(file_path, "wb") as buffer:
      shutil.copyfileobj(file.file, buffer)
  ```
- **Recommended Correction**:
  1. Enforce a strict allowlist of extensions (e.g. `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`, `.svg`, `.docx`).
  2. Validate MIME type using header analysis and signature bytes.
  3. Enforce maximum file size (e.g., 10MB).
  4. Sanitize filenames using `werkzeug.utils.secure_filename` or random UUIDs.
- **Verification Method**: Submit files with disallowed extensions (`.html`, `.exe`) or oversized payloads; verify `400 Bad Request` or `413 Payload Too Large`.

---

### SEC-05 to SEC-09: Unauthenticated Mutating Routes (Content, Pages, Projects, Services, Settings)
- **Severity**: **HIGH** (CVSS 8.6)
- **Files**:
  - `backend/routes/content.py:26` (`PUT /content/`)
  - `backend/routes/pages.py:26, 59` (`PUT /pages/{page_name}`, `POST /pages/`)
  - `backend/routes/projects.py:38, 53, 81` (`POST /projects/`, `PUT /{id}`, `DELETE /{id}`)
  - `backend/routes/services.py:30, 41, 64` (`POST /services/`, `PUT /{id}`, `DELETE /{id}`)
  - `backend/routes/settings.py:30` (`PUT /settings/`)
- **Description**: Mutating operations on core platform CMS collections (site title, services, pricing, portfolio items, dynamic page text, global configuration) do not require authentication. Any network client can deface the website or destroy content.
- **Actual Evidence**:
  ```python
  # backend/routes/settings.py:29-31
  @router.put("/", response_model=SettingsResponse)
  async def update_settings(settings_data: SettingsUpdate):
      """Update global settings"""
  
  # backend/routes/projects.py:37-38
  @router.post("/", response_model=ProjectResponse)
  async def create_project(project_data: ProjectCreate):
      """Create a new project"""
  ```
- **Recommended Correction**: Inject `current_admin: dict = Depends(get_current_admin)` across all update and deletion endpoints in `content.py`, `pages.py`, `projects.py`, `services.py`, and `settings.py`.
- **Verification Method**: Issue unauthenticated PUT/POST/DELETE requests against each endpoint; assert `401 Unauthorized`.

---

### SEC-10: Unauthenticated Customer Chat Enumeration
- **Severity**: **HIGH** (CVSS 7.5)
- **File**: `backend/routes/chat.py` (Lines 96-120)
- **Description**: The `/chat/user-conversation` endpoint accepts an `email` query parameter and returns the full conversation history between that email and the support team without requiring authentication, a verification PIN, or session cookie.
- **Actual Evidence**:
  ```python
  # backend/routes/chat.py:96-111
  @router.get("/user-conversation")
  async def get_user_conversation(email: str, phone: Optional[str] = None):
      query = {"customer_email": email}
      if phone:
          query["customer_phone"] = phone
      conversation = await conversations_collection.find_one(query)
  ```
- **Recommended Correction**: Issue an ephemeral conversation token (`chat_token`) upon session initialization stored in client sessionStorage, or require authenticated client credentials if the user is a registered client.
- **Verification Method**: Verify that arbitrary email queries without an associated active session identifier cannot access conversations.

---

### SEC-11: Project File Upload Missing Validation
- **Severity**: **HIGH** (CVSS 7.5)
- **File**: `backend/routes/admin_client_projects.py` (Lines 760-805)
- **Description**: Uploading project deliverables accepts raw `UploadFile` streams without content type validation or file size limits.
- **Recommended Correction**: Centralize file validation into a reusable utility (`utils/file_security.py`) enforcing extensions, magic signatures, and size bounds across both `storage.py` and `admin_client_projects.py`.
- **Verification Method**: Test file uploads with invalid payloads and ensure rejection with informative errors.

---

### SEC-12: Default Hardcoded Password in Super Admin Bootstrap
- **Severity**: **HIGH** (CVSS 7.5)
- **File**: `backend/routes/admins.py` (Line 78)
- **Description**: `/admins/init` bootstraps a super admin with hardcoded password `"admin123"`. If triggered on a fresh deployment, this installs a known administrative credential.
- **Actual Evidence**:
  ```python
  # backend/routes/admins.py:76-78
  admin = Admin(
      username="admin",
      password_hash=hash_password("admin123"),
      role="super_admin",
  ```
- **Recommended Correction**: Require `INIT_SUPERADMIN_PASSWORD` from the environment, generate a cryptographically secure random password if omitted, or accept initialization credentials via payload only once when database count is zero.
- **Verification Method**: Verify bootstrap requires environment variable or returns a generated one-time secret.

---

### SEC-13: Hardcoded Linux Upload Path
- **Severity**: **HIGH** (CVSS 7.0)
- **File**: `backend/routes/storage.py` (Line 15)
- **Description**: `UPLOAD_DIR = Path("/app/public/uploads")` assumes a Linux container environment. On Windows or developer machines, this resolves to `C:\app\public\uploads` which may fail or create arbitrary directories in the root drive.
- **Recommended Correction**: Use path resolution relative to `backend/` or configured via `UPLOAD_DIR` environment variable, defaulting to `backend/uploads` with `exist_ok=True`.
- **Verification Method**: Verify upload directory creation succeeds cleanly across Windows and Linux environments.

---

### SEC-14: Broken Dockerfile Startup Command
- **Severity**: **HIGH** (CVSS 7.0)
- **File**: `backend/Dockerfile` (Line 10)
- **Description**: Dockerfile specifies `CMD ["python", "app.py"]`, but `app.py` does not exist in the backend repository. Running the container results in immediate failure.
- **Recommended Correction**: Change entry point to `CMD ["python", "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]`.
- **Verification Method**: Inspect container definition and verify command syntax matches the application architecture.

---

### SEC-15: Type Mismatch in Credentials Router
- **Severity**: **MEDIUM** (CVSS 5.3)
- **File**: `backend/routes/credentials.py` (Lines 26, 30, 53, 79)
- **Description**: Functions declare `current_admin: Admin = Depends(get_current_admin)`, but `get_current_admin` returns a python `dict`. Accessing `current_admin.role` causes an unhandled `AttributeError: 'dict' object has no attribute 'role'` resulting in an internal server error (500).
- **Actual Evidence**:
  ```python
  # backend/routes/credentials.py:25-30
  async def get_all_credentials(current_admin: Admin = Depends(get_current_admin)):
      if current_admin.role != "super_admin" and not current_admin.permissions.canViewCredentials:
  ```
- **Recommended Correction**: Access dictionary keys using `current_admin.get('role')` and `current_admin.get('permissions', {}).get('canViewCredentials')`.
- **Verification Method**: Call `/api/credentials/` with valid admin bearer token and verify 200 response without AttributeError.

---

### SEC-16: ReDoS Vulnerability in Notes Search
- **Severity**: **MEDIUM** (CVSS 5.3)
- **File**: `backend/routes/notes.py` (Lines 23-28)
- **Description**: The `search` query parameter is interpolated directly into a MongoDB `$regex` without `re.escape()`. Complex or catastrophic backtracking regex expressions (e.g. `(a+)+$`) can degrade database server CPU performance.
- **Actual Evidence**:
  ```python
  # backend/routes/notes.py:24-28
  if search:
      query["$or"] = [
          {"name": {"$regex": search, "$options": "i"}},
          {"content": {"$regex": search, "$options": "i"}},
          {"tags": {"$regex": search, "$options": "i"}}
      ]
  ```
- **Recommended Correction**: Sanitize user input with `re.escape(search)` before passing to `$regex`.
- **Verification Method**: Send regex meta-characters (`(`, `*`, `+`) in query string and verify literal matching without regex compilation errors or delays.

---

### SEC-17: Frontend Token Collision & Improper 401 Redirect
- **Severity**: **MEDIUM** (CVSS 5.0)
- **File**: `frontend/src/services/api.js` (Lines 44-50, 92-95)
- **Description**:
  1. The Axios interceptor prioritizes `localStorage.getItem('admin_token')` over `client_token`. When both exist, requests meant for the client portal send the admin JWT.
  2. On any 401 response, `api.js` blindly redirects to `/admin/login`, disorienting clients using `/client/dashboard`.
- **Recommended Correction**: Differentiate authorization headers based on active session context or route target, and redirect 401 responses to `/client/login` if the user is on a `/client/*` route.
- **Verification Method**: Log into both portals, perform client actions, trigger a token expiration, and verify redirection to `/client/login`.

---

### SEC-18: Absence of Rate Limiting
- **Severity**: **MEDIUM** (CVSS 5.3)
- **File**: `backend/routes/admins.py`, `backend/routes/client_auth.py`, `backend/routes/chat.py`
- **Description**: Endpoints for admin login, client login, and chat messaging lack rate limiting, exposing the system to password brute-force and automated spam.
- **Recommended Correction**: Introduce an in-memory or Redis-backed sliding window rate limiter middleware on sensitive authentication and submission endpoints.
- **Verification Method**: Execute repeated failed login requests and verify HTTP `429 Too Many Requests` is returned after threshold.

---

### SEC-19: Absence of Structured Audit Logging
- **Severity**: **MEDIUM** (CVSS 4.3)
- **File**: Backend Architecture
- **Description**: Mutating operations, login attempts, credential changes, and file uploads are not persisted to an immutable audit trail.
- **Recommended Correction**: Create an `audit_logs` collection and utility (`utils/audit_logger.py`) recording actor, action, resource, IP address, timestamp, and outcome.
- **Verification Method**: Perform administrative action and verify the audit document is written to `audit_logs`.

---

### SEC-20: Missing Database Indexes
- **Severity**: **LOW** (CVSS 3.0)
- **File**: `backend/database.py`
- **Description**: Collections rely on ad-hoc scans for `id`, `email`, `client_id`, `project_id`, and `created_at`.
- **Recommended Correction**: Add an asynchronous index initialization routine on application startup creating unique indexes on `id`, `email`, `username`, and compound indexes on foreign keys.
- **Verification Method**: Inspect `collection.index_information()` on startup and verify required indexes exist.
