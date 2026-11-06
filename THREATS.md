# 🛡️ METECHQ Threat Model & Threat Matrix (THREATS.md)

This threat model outlines the attack surfaces, threat vectors, STRIDE classification, severity ratings, implemented countermeasures, and verification test cases for the **METECHQ** platform.

---

## 1. System Threat Model Overview

```
                      +---------------------------------------+
                      |               INTERNET                |
                      +---------------------------------------+
                                          |
                     HTTPS / TLS          |  HTTP / Port 80
                                          v
                      +---------------------------------------+
                      |       Nginx / Reverse Proxy           |
                      |   - Security Headers Injected         |
                      |   - Static Asset Caching              |
                      +---------------------------------------+
                               |                    |
                               v                    v
                   +-------------------+   +--------------------+
                   |  React SPA        |   | FastAPI Backend    |
                   |  (Client/Admin)   |   | (Port 8000)        |
                   +-------------------+   +--------------------+
                                                    |
                         +--------------------------+--------------------------+
                         |                          |                          |
                         v                          v                          v
               +-------------------+      +-------------------+      +-------------------+
               | Sliding-Window    |      | Auth & RBAC Guard |      | File Security &   |
               | Rate Limiter      |      | Dual JWT Realms   |      | Magic-Byte Check  |
               +-------------------+      +-------------------+      +-------------------+
                         |                          |                          |
                         +--------------------------+--------------------------+
                                                    |
                                                    v
                                      +---------------------------+
                                      | MongoDB Database          |
                                      | - Motor Async             |
                                      | - Escaped Regex           |
                                      | - Pre-built Indexes       |
                                      +---------------------------+
```

---

## 2. STRIDE Threat Matrix

| Threat ID | Category | Target Component | Threat Scenario | Severity | Countermeasure Implemented | Verification Test |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TH-01** | **Spoofing** | `/admins/login` & `/client/login` | Attacker executes high-speed credential stuffing or brute-force dictionary attack. | **High** | Sliding-window `RateLimiter` enforces 5 attempts per 5-minute window per IP. | `test_invalid_login_rejected`, `test_client_invalid_login_rejected` |
| **TH-02** | **Spoofing** | JWT Token Validation | Attacker signs forged JWT tokens using known weak or fallback default secret keys. | **Critical** | Removed fallback secrets; `validate_config()` rejects production startup if default secrets are used. Minimum 32-character key enforced. | `backend/config.py:validate_config` |
| **TH-03** | **Elevation of Privilege** | `/api/auth/register` | External user sends POST request to create an unauthorized administrator account. | **Critical** | Route protected by `Depends(require_super_admin)`. Public unauthenticated user registration is completely disabled. | `test_unauthenticated_user_registration_forbidden` |
| **TH-04** | **Tampering** | CMS Endpoints (`/contacts`, `/content`, `/pages`, `/projects`, `/services`, `/settings`) | Public unauthenticated visitor sends PUT/POST/DELETE to modify agency content, delete contacts, or deface services. | **Critical** | Injected `Depends(get_current_admin)` across all modification endpoints. | `test_unauthenticated_contact_deletion_forbidden`, `test_unauthenticated_content_update_forbidden`, `test_unauthenticated_project_creation_forbidden` |
| **TH-05** | **Information Disclosure** | `/api/contacts/admin/all` | Public caller queries endpoint to harvest customer contact names, emails, and inquiry messages. | **High** | Route restricted to authenticated admins with valid JWT. | `test_unauthenticated_contacts_all_forbidden` |
| **TH-06** | **Information Disclosure** | `/api/projects` | Anonymous visitor views confidential unreleased client projects (`is_private: True`). | **Medium** | Filtered public queries to return only public projects; private projects require admin authentication. | `test_public_projects_readable` |
| **TH-07** | **Tampering / RCE** | File Uploads (`/storage/upload`) | Attacker uploads `.exe`, `.sh`, `.php`, or `.svg` containing embedded `<script>alert(1)</script>` or XSS vectors. | **Critical** | Implemented `file_security.py`: strict extension allowlist, binary magic-byte header validation, and SVG active script inspection. | `test_upload_disallowed_extension_rejected`, `test_upload_script_svg_rejected` |
| **TH-08** | **Tampering** | File Storage Filesystem | Path traversal attacks using `../../etc/passwd` in filenames. | **High** | Enforced filename sanitization and prepended random UUIDs; resolved paths checked against root upload directory. | `backend/utils/file_security.py` |
| **TH-09** | **Information Disclosure** | Private Client Project Files | Direct unauthenticated access to client project assets via public static file serving. | **High** | Secured private file downloads behind authenticated endpoint `/api/storage/files/{filename}`. | `backend/routes/storage.py` |
| **TH-10** | **Denial of Service** | Notes Search (`/notes?search=...`) | Attacker sends malicious regex input triggering catastrophic backtracking (ReDoS). | **Medium** | Escaped all search queries using `re.escape()` prior to constructing MongoDB `$regex` expressions. | `test_admin_notes_crud_sanitized` |
| **TH-11** | **Repudiation** | Administrative Operations | Malicious or unauthorized admin operations occur without an audit trail. | **Medium** | Implemented append-only MongoDB `audit_logs` collection logging actor, IP, timestamp, action, and sanitized resource metadata. | `test_admin_audit_logs_accessible` |
| **TH-12** | **Information Disclosure** | Browser Clickjacking & MIME Sniffing | Framing website in malicious iframe; browser executing disguised scripts. | **Low** | Injected `SecurityHeadersMiddleware` with `X-Frame-Options: SAMEORIGIN` and `X-Content-Type-Options: nosniff`. | `test_security_headers_present` |

---

## 3. Defense-in-Depth Summary

1. **Authentication Layer**: Dual JWT secrets, bcrypt hashing with salt rounds, brute-force rate limiter.
2. **Authorization Layer**: Explicit RBAC on all endpoints, superadmin isolation for user creation and logs.
3. **Storage Layer**: Magic-byte sniffing, SVG script sanitization, size boundaries, traversal defense.
4. **Database Layer**: Motor async driver, escaped regex expressions, pre-compiled query indexes.
5. **Network Layer**: Nginx reverse proxy, security headers middleware, strict CORS origin controls.
