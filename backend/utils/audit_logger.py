import logging
import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from database import db

logger = logging.getLogger("metechq.audit")
audit_collection = db["audit_logs"]

SENSITIVE_KEYS = {"password", "password_hash", "token", "access_token", "secret", "authorization", "value"}

def sanitize_details(details: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """Recursively redacts sensitive keys from audit log details"""
    if not details:
        return {}
    sanitized = {}
    for k, v in details.items():
        if k.lower() in SENSITIVE_KEYS:
            sanitized[k] = "[REDACTED]"
        elif isinstance(v, dict):
            sanitized[k] = sanitize_details(v)
        else:
            sanitized[k] = v
    return sanitized

async def record_audit_log(
    actor_id: str,
    actor_name: str,
    actor_role: str,
    action: str,
    resource_type: str,
    resource_id: str = "",
    details: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None,
    status: str = "success"
):
    """
    Persists an immutable audit log document to MongoDB.
    Guaranteed not to throw exceptions to avoid interrupting primary workflows.
    """
    try:
        clean_details = sanitize_details(details)
        log_entry = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "actor_id": actor_id,
            "actor_name": actor_name,
            "actor_role": actor_role,
            "action": action,
            "resource_type": resource_type,
            "resource_id": str(resource_id),
            "ip_address": ip_address or "unknown",
            "status": status,
            "details": clean_details
        }
        await audit_collection.insert_one(log_entry)
    except Exception as e:
        logger.error(f"Failed to record audit log: {str(e)}")
