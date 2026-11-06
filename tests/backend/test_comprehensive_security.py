import pytest
import requests
import uuid

BASE_URL = "http://127.0.0.1:8002/api"

@pytest.fixture(scope="module")
def admin_token():
    """Authenticates as super admin and yields JWT bearer token"""
    for creds in [
        {"username": "maneesh", "password": "maneesh123"},
        {"username": "admin", "password": "admin123"},
        {"username": "admin", "password": "Admin@123456"}
    ]:
        res = requests.post(f"{BASE_URL}/admins/login", json=creds)
        if res.status_code == 200:
            data = res.json()
            token = data.get("token") or data.get("access_token")
            if token:
                return token
    raise AssertionError("Super admin login failed for all test credentials")

# ==============================================================================
# 1. ROOT & PUBLIC ACCESS TESTS
# ==============================================================================

def test_api_root_healthy():
    res = requests.get(f"{BASE_URL}/")
    assert res.status_code == 200
    assert "METECHQ API is running" in res.json().get("message", "")

def test_public_projects_readable():
    res = requests.get(f"{BASE_URL}/projects/")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_public_services_readable():
    res = requests.get(f"{BASE_URL}/services/")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_public_about_readable():
    res = requests.get(f"{BASE_URL}/about/")
    assert res.status_code == 200

def test_public_settings_readable():
    res = requests.get(f"{BASE_URL}/settings/")
    assert res.status_code == 200

def test_security_headers_present():
    res = requests.get(f"{BASE_URL}/")
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-Frame-Options") == "SAMEORIGIN"
    assert res.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"

# ==============================================================================
# 2. NEGATIVE SECURITY TESTS — UNPROTECTED ENDPOINTS ELIMINATED
# ==============================================================================

def test_unauthenticated_contacts_all_forbidden():
    res = requests.get(f"{BASE_URL}/contacts/admin/all")
    assert res.status_code == 401

def test_unauthenticated_contact_update_forbidden():
    res = requests.put(f"{BASE_URL}/contacts/dummy-id", json={"name": "Attacker"})
    assert res.status_code == 401

def test_unauthenticated_contact_deletion_forbidden():
    res = requests.delete(f"{BASE_URL}/contacts/dummy-id")
    assert res.status_code == 401

def test_unauthenticated_content_update_forbidden():
    res = requests.put(f"{BASE_URL}/content/", json={"hero": {"title": "Defaced"}})
    assert res.status_code == 401

def test_unauthenticated_pages_update_forbidden():
    res = requests.put(f"{BASE_URL}/pages/home", json={"hero": "Defaced"})
    assert res.status_code == 401

def test_unauthenticated_project_creation_forbidden():
    res = requests.post(f"{BASE_URL}/projects/", json={"title": "Hacked Project"})
    assert res.status_code == 401

def test_unauthenticated_service_creation_forbidden():
    res = requests.post(f"{BASE_URL}/services/", json={"title": "Hacked Service"})
    assert res.status_code == 401

def test_unauthenticated_settings_update_forbidden():
    res = requests.put(f"{BASE_URL}/settings/", json={"agency_name": "Hacked"})
    assert res.status_code == 401

def test_unauthenticated_user_registration_forbidden():
    res = requests.post(
        f"{BASE_URL}/auth/register",
        json={"name": "Attacker", "email": "attacker@evil.com", "password": "Password123!", "role": "super_admin"}
    )
    assert res.status_code in [401, 403]

# ==============================================================================
# 3. AUTHENTICATION & RATE LIMITING TESTS
# ==============================================================================

def test_invalid_login_rejected():
    res = requests.post(
        f"{BASE_URL}/admins/login",
        json={"username": "nonexistent_admin", "password": "wrong_password_123"}
    )
    assert res.status_code == 401

def test_client_invalid_login_rejected():
    res = requests.post(
        f"{BASE_URL}/client/auth/login",
        json={"email": "nonexistent_client@test.com", "password": "wrong_password"}
    )
    assert res.status_code == 401

# ==============================================================================
# 4. AUTHORIZED ADMIN FUNCTIONALITY TESTS
# ==============================================================================

def test_admin_contacts_accessible(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    res = requests.get(f"{BASE_URL}/contacts/admin/all", headers=headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_admin_notes_crud_sanitized(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    # Create note
    res = requests.post(
        f"{BASE_URL}/notes/",
        headers=headers,
        json={"name": "Test Note Security", "content": "Security testing content", "tags": ["qa", "security"]}
    )
    assert res.status_code == 200
    note_id = res.json()["id"]

    # Search with regex special characters to test ReDoS escaping
    search_res = requests.get(f"{BASE_URL}/notes/?search=Security.*", headers=headers)
    assert search_res.status_code == 200

    # Delete note
    del_res = requests.delete(f"{BASE_URL}/notes/{note_id}", headers=headers)
    assert del_res.status_code == 200

def test_admin_audit_logs_accessible(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    res = requests.get(f"{BASE_URL}/admins/audit-logs", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "audit_logs" in data
    assert isinstance(data["audit_logs"], list)

# ==============================================================================
# 5. FILE UPLOAD SECURITY TESTS
# ==============================================================================

def test_upload_disallowed_extension_rejected(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    files = {"file": ("malicious.exe", b"MZDummyExecutablePayload", "application/x-msdownload")}
    res = requests.post(f"{BASE_URL}/storage/upload", headers=headers, files=files)
    assert res.status_code == 400
    assert "not permitted" in res.json().get("detail", "")

def test_upload_script_svg_rejected(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    svg_payload = b"<svg xmlns='http://www.w3.org/2000/svg'><script>alert(1)</script></svg>"
    files = {"file": ("xss.svg", svg_payload, "image/svg+xml")}
    res = requests.post(f"{BASE_URL}/storage/upload", headers=headers, files=files)
    assert res.status_code == 400
    assert "forbidden script" in res.json().get("detail", "")

def test_admin_audit_chain_integrity(admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    res = requests.get(f"{BASE_URL}/admins/audit-logs/verify", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data.get("verified") is True
    assert data.get("chain_intact") is True

def test_rate_limiter_sliding_window_active():
    unique_user = f"attacker_{uuid.uuid4().hex[:8]}"
    for i in range(5):
        requests.post(f"{BASE_URL}/admins/login", json={"username": unique_user, "password": "WrongPassword!"})
    # 6th attempt should be blocked with 429 Too Many Requests
    blocked_res = requests.post(f"{BASE_URL}/admins/login", json={"username": unique_user, "password": "WrongPassword!"})
    assert blocked_res.status_code == 429
    assert "Too many failed login attempts" in blocked_res.json().get("detail", "")

