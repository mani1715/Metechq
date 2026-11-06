# 🔐 METECHQ Security Architecture & Configuration Guide

This document defines the security architecture, configuration standards, and deployment hardening rules for the **METECHQ** agency and client portal platform.

---

## 1. Security Architecture Summary

METECHQ implements defense-in-depth across the application lifecycle:

1. **Dual Secret Domain Isolation**:
   - `JWT_SECRET`: Admin dashboard authentication.
   - `CLIENT_JWT_SECRET`: Independent client portal authentication.
   - Even if one secret realm is rotated or invalidated, the other realm remains securely isolated.

2. **Automated Configuration Validation**:
   - `backend/config.py` runs `validate_config()` on application startup.
   - In `ENVIRONMENT=production`, the application refuses to start if placeholder or default secrets are detected.
   - Minimum secret length is enforced (>= 32 characters).

3. **Strict RBAC & Resource Ownership (Zero IDOR)**:
   - All administrative routes (`/admin/*`, `/projects`, `/services`, `/contacts/admin/*`, `/pages`, `/content`, `/settings`) require authenticated admin tokens with valid claims.
   - Client portal endpoints enforce tenant isolation: clients can only query and mutate projects, documents, and tasks assigned to their specific `client_id`.
   - Super-admin authorization (`require_super_admin`) is strictly required for admin user provisioning (`/api/auth/register`) and viewing audit logs.

4. **Sliding-Window Rate Limiting**:
   - Implemented via `backend/utils/rate_limiter.py`.
   - Admin and client login endpoints enforce strict brute-force limits (5 failed attempts per 5-minute sliding window per client IP).
   - AI conversation endpoints are protected from denial-of-wallet / resource exhaustion attacks.

5. **Multi-Layer File & Upload Security**:
   - Implemented via `backend/utils/file_security.py`.
   - Extension allowlisting (`.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.zip`).
   - Magic byte MIME verification: checks file binary header against declared extension.
   - Active content scanning: SVG files are checked for embedded `<script>`, `javascript:`, and malicious event attributes (`onload=`).
   - Strict size limiting: 15MB file ceiling.
   - Path traversal prevention: UUID-prefixed randomized filenames; sanitized disk paths.
   - Authenticated private downloads: files are served via `/api/storage/files/{filename}` requiring active authentication.

6. **Defense-in-Depth HTTP Headers**:
   - `X-Content-Type-Options: nosniff` (MIME sniffing disabled).
   - `X-Frame-Options: SAMEORIGIN` (Clickjacking mitigation).
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `Permissions-Policy: geolocation=(), camera=(), microphone=()`.

7. **Tamper-Evident Audit Logging**:
   - Implemented in `backend/utils/audit_logger.py`.
   - Records actor ID, username, action, resource, IP address, and status.
   - Automatically sanitizes and removes credentials, passwords, and tokens before logging.
   - Stored in append-only MongoDB `audit_logs` collection with query indexes.

---

## 2. Environment Variables Specification

| Variable | Required in Prod | Description | Safe Example Format |
| :--- | :--- | :--- | :--- |
| `ENVIRONMENT` | Yes | `production`, `staging`, or `development` | `production` |
| `JWT_SECRET` | Yes | 32+ char secret for Admin tokens | `openssl rand -hex 32` |
| `CLIENT_JWT_SECRET`| Yes | 32+ char secret for Client tokens | `openssl rand -hex 32` |
| `MONGO_URL` | Yes | Production MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/metechq` |
| `DB_NAME` | Yes | Database name | `metechq` |
| `ALLOWED_ORIGINS` | Yes | Comma-separated list of allowed CORS origins | `https://metechq.com,https://admin.metechq.com` |
| `UPLOAD_DIR` | No | Absolute or relative upload directory | `/app/uploads` |
| `INIT_SUPERADMIN_PASSWORD` | Optional | Initial bootstrap password for `admin` account | `A$trongRandomPassword2026!` |

---

## 3. Secret Generation & Key Rotation

### Generating Cryptographic Secrets
Run in your secure terminal:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Or with OpenSSL:
```bash
openssl rand -hex 32
```

### Rotating Compromised Secrets
1. Generate new strings for `JWT_SECRET` and `CLIENT_JWT_SECRET`.
2. Update the environment variables in your hosting provider (Render, Railway, AWS ECS, or Docker Compose).
3. Restart the backend service.
4. All existing tokens will be immediately invalidated, forcing active sessions to re-authenticate with the database.

---

## 4. Verification & Security Testing

Run the automated security test suite to verify authorization, headers, rate limits, and upload defenses:

```bash
# Run backend security test suite
python -m pytest tests/backend/test_comprehensive_security.py -v

# Run full backend API functional tests
python tests/backend/backend_test.py

# Run client portal isolation tests
python tests/backend/client_management_test.py
```
