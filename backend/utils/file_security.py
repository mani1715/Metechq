import os
import uuid
import re
from pathlib import Path
from typing import Tuple, Set
from fastapi import UploadFile, HTTPException, status

MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

ALLOWED_EXTENSIONS: Set[str] = {
    # Images
    ".jpg", ".jpeg", ".png", ".webp", ".gif", ".ico",
    # Documents
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".csv",
    # Archives
    ".zip"
}

DISALLOWED_EXTENSIONS: Set[str] = {
    ".exe", ".bat", ".cmd", ".sh", ".php", ".phtml", ".py", ".pyc",
    ".js", ".mjs", ".jar", ".jsp", ".asp", ".aspx", ".cgi", ".pl",
    ".dll", ".scr", ".vbs", ".ps1", ".msi", ".com", ".hta"
}

# Known file signatures (magic numbers)
MAGIC_SIGNATURES = {
    b"\xff\xd8\xff": [".jpg", ".jpeg"],
    b"\x89PNG\r\n\x1a\n": [".png"],
    b"GIF87a": [".gif"],
    b"GIF89a": [".gif"],
    b"%PDF-": [".pdf"],
    b"PK\x03\x04": [".zip", ".docx", ".xlsx"],
}

def sanitize_filename(filename: str) -> str:
    """Removes path traversals, null bytes, and illegal characters"""
    if not filename:
        return "unnamed_file"
    # Strip directory paths
    base_name = os.path.basename(filename)
    # Strip null bytes and control characters
    clean_name = re.sub(r'[\x00-\x1f\x7f]', '', base_name)
    # Replace dangerous characters with underscores
    clean_name = re.sub(r'[^a-zA-Z0-9._-]', '_', clean_name)
    # Prevent hidden files
    clean_name = clean_name.lstrip('.')
    return clean_name or "file"

def validate_file_security(file: UploadFile, max_size: int = MAX_FILE_SIZE_BYTES) -> Tuple[str, str]:
    """
    Validates file extension, magic headers, and file size.
    Returns: (file_extension: str, safe_original_name: str)
    Raises: HTTPException with 400 or 413
    """
    safe_name = sanitize_filename(file.filename)
    ext = os.path.splitext(safe_name)[1].lower()

    if not ext:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File has no extension. Please upload a file with a valid extension."
        )

    if ext in DISALLOWED_EXTENSIONS or ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension '{ext}' is not permitted. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    # Bound the whole upload, not only the signature sample.
    file.file.seek(0, os.SEEK_END)
    size = file.file.tell()
    file.file.seek(0)
    if size > max_size:
        raise HTTPException(status_code=413, detail="File exceeds the upload size limit.")
    if size == 0:
        raise HTTPException(status_code=400, detail="Empty files are not permitted.")

    # Read header sample for magic number check
    try:
        header_sample = file.file.read(512)
        file.file.seek(0)  # Rewind pointer
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unable to read file content: {str(e)}"
        )

    # Accept any valid signature for an extension (GIF has two valid headers).
    signatures = [magic for magic, extensions in MAGIC_SIGNATURES.items() if ext in extensions]
    if signatures and not any(header_sample.startswith(magic) for magic in signatures):
        raise HTTPException(status_code=400, detail="File signature does not match the declared extension.")
    if ext == ".webp" and not (header_sample.startswith(b"RIFF") and header_sample[8:12] == b"WEBP"):
        raise HTTPException(status_code=400, detail="Invalid WebP signature.")
    if ext == ".ico" and not header_sample.startswith(b"\x00\x00\x01\x00"):
        raise HTTPException(status_code=400, detail="Invalid icon signature.")
    if ext in {".doc", ".xls"} and not header_sample.startswith(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"):
        raise HTTPException(status_code=400, detail="Invalid Office document signature.")

    return ext, safe_name

def generate_secure_path(base_dir: Path, file_extension: str) -> Tuple[str, Path]:
    """
    Generates a cryptographically random UUID filename and verifies it resides
    strictly within base_dir (guaranteeing path traversal immunity).
    """
    unique_id = str(uuid.uuid4())
    secure_filename = f"{unique_id}{file_extension}"
    target_path = (base_dir / secure_filename).resolve()
    base_resolved = base_dir.resolve()

    # Guard against directory traversal
    if not target_path.is_relative_to(base_resolved):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Illegal storage path detected."
        )

    return unique_id, target_path
