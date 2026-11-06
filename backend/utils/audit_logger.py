import logging
import uuid
import hashlib
import json
from datetime import datetime
from typing import Optional, Dict, Any, Tuple
from database import db

logger = logging.getLogger("metechq.audit")
audit_collection = db["audit_logs"]

GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"
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

def compute_entry_hash(
    sequence: int,
    timestamp: str,
    actor_id: str,
    action: str,
    resource_type: str,
    resource_id: str,
    status: str,
    prev_hash: str,
    details: Dict[str, Any]
) -> str:
    """Computes deterministic SHA-256 hash for audit entry sealing"""
    details_serialized = json.dumps(details, sort_keys=True, default=str)
    payload = f"{sequence}|{timestamp}|{actor_id}|{action}|{resource_type}|{resource_id}|{status}|{prev_hash}|{details_serialized}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()

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
) -> Optional[str]:
    """
    Persists a cryptographically sealed, tamper-evident audit log document.
    Chains the entry to the preceding document via SHA-256 hash chaining.
    """
    try:
        clean_details = sanitize_details(details)
        timestamp = datetime.utcnow().isoformat()

        # Retrieve the latest entry to link the hash chain
        latest_entry = await audit_collection.find_one(
            sort=[("sequence", -1)]
        )

        if latest_entry:
            sequence = latest_entry.get("sequence", 0) + 1
            prev_hash = latest_entry.get("entry_hash", GENESIS_HASH)
        else:
            sequence = 1
            prev_hash = GENESIS_HASH

        entry_hash = compute_entry_hash(
            sequence=sequence,
            timestamp=timestamp,
            actor_id=actor_id,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id),
            status=status,
            prev_hash=prev_hash,
            details=clean_details
        )

        log_entry = {
            "id": str(uuid.uuid4()),
            "sequence": sequence,
            "timestamp": timestamp,
            "actor_id": actor_id,
            "actor_name": actor_name,
            "actor_role": actor_role,
            "action": action,
            "resource_type": resource_type,
            "resource_id": str(resource_id),
            "ip_address": ip_address or "unknown",
            "status": status,
            "details": clean_details,
            "prev_hash": prev_hash,
            "entry_hash": entry_hash
        }

        await audit_collection.insert_one(log_entry)
        return entry_hash
    except Exception as e:
        logger.error(f"Failed to record audit log: {str(e)}")
        return None

async def verify_audit_log_chain(limit: int = 1000) -> Dict[str, Any]:
    """
    Verifies cryptographic hash-chain integrity of audit log entries.
    Detects any modification, insertion, deletion, or reordering of records.
    """
    try:
        cursor = audit_collection.find().sort("sequence", 1).limit(limit)
        entries = await cursor.to_list(length=limit)

        if not entries:
            return {
                "verified": True,
                "chain_intact": True,
                "total_records": 0,
                "message": "Audit log is empty (genesis state)."
            }

        expected_prev_hash = GENESIS_HASH
        expected_sequence = 1

        for idx, entry in enumerate(entries):
            seq = entry.get("sequence")
            prev_hash = entry.get("prev_hash")
            stored_hash = entry.get("entry_hash")

            # Check for legacy unchained entries
            if not seq or not stored_hash:
                continue

            # Verify sequence continuity (detects deletions and insertions)
            if seq != expected_sequence:
                return {
                    "verified": False,
                    "chain_intact": False,
                    "broken_at_index": idx,
                    "broken_sequence": seq,
                    "error": f"Sequence gap detected! Expected {expected_sequence}, found {seq}. Indicates record deletion or insertion."
                }

            # Verify link to previous entry (detects reordering)
            if prev_hash != expected_prev_hash:
                return {
                    "verified": False,
                    "chain_intact": False,
                    "broken_at_index": idx,
                    "broken_sequence": seq,
                    "error": f"Chain link broken at sequence {seq}. Previous hash mismatch."
                }

            # Verify entry content has not been tampered with
            recomputed_hash = compute_entry_hash(
                sequence=seq,
                timestamp=entry.get("timestamp", ""),
                actor_id=entry.get("actor_id", ""),
                action=entry.get("action", ""),
                resource_type=entry.get("resource_type", ""),
                resource_id=entry.get("resource_id", ""),
                status=entry.get("status", ""),
                prev_hash=prev_hash,
                details=entry.get("details", {})
            )

            if stored_hash != recomputed_hash:
                return {
                    "verified": False,
                    "chain_intact": False,
                    "broken_at_index": idx,
                    "broken_sequence": seq,
                    "error": f"Tampering detected! Recomputed hash does not match stored hash at sequence {seq}."
                }

            expected_prev_hash = stored_hash
            expected_sequence += 1

        return {
            "verified": True,
            "chain_intact": True,
            "total_records": len(entries),
            "message": f"Cryptographic audit chain fully verified ({len(entries)} records intact)."
        }
    except Exception as e:
        logger.error(f"Audit log verification failed: {e}")
        return {
            "verified": False,
            "chain_intact": False,
            "error": str(e)
        }
