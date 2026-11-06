from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from fastapi.responses import FileResponse
from typing import List
from schemas.storage import StorageItemCreate, StorageItemUpdate
from database import storage_collection
from auth.admin_auth import get_current_admin, check_permission
from models.storage import StorageItem
from datetime import datetime
import os
from pathlib import Path
from config import UPLOAD_DIR
from utils.file_security import validate_file_security, generate_secure_path, MAX_FILE_SIZE_BYTES, sanitize_filename

router = APIRouter(prefix="/storage", tags=["storage"])

# Ensure uploads directory exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.get("/items")
async def get_storage_items(current_admin: dict = Depends(get_current_admin)):
    """Get all storage items visible to current admin"""
    if current_admin['role'] == 'super_admin':
        query = {}
    else:
        if not check_permission(current_admin, 'canAccessStorage'):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access storage. Contact super admin."
            )
        query = {
            "$or": [
                {"created_by": current_admin['username']},
                {"visibleTo": current_admin['username']},
                {"visibleTo": []}  # Public items
            ]
        }
    
    items = await storage_collection.find(query).to_list(length=1000)
    
    result = []
    for item in items:
        result.append({
            "id": item['id'],
            "title": item['title'],
            "content": item.get('content', ''),
            "type": item.get('type', 'note'),
            "fileUrl": item.get('fileUrl'),
            "fileName": item.get('fileName'),
            "tags": item.get('tags', []),
            "visibleTo": item.get('visibleTo', []),
            "createdAt": item['created_at'],
            "createdBy": item['created_by'],
            "updatedAt": item.get('updated_at', item['created_at'])
        })
    
    return {"items": result}

@router.post("/items")
async def create_storage_item(
    item_data: StorageItemCreate,
    current_admin: dict = Depends(get_current_admin)
):
    """Create new storage item"""
    if not check_permission(current_admin, 'canAccessPrivateStorage') and current_admin['role'] != 'super_admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    item = StorageItem(
        title=item_data.title,
        content=item_data.content,
        type=item_data.type,
        fileUrl=item_data.fileUrl,
        fileName=item_data.fileName,
        tags=item_data.tags or [],
        visibleTo=item_data.visibleTo or [],
        created_by=current_admin['username']
    )
    
    item_dict = item.model_dump()
    item_dict['created_at'] = item_dict['created_at'].isoformat()
    item_dict['updated_at'] = item_dict['updated_at'].isoformat()
    
    await storage_collection.insert_one(item_dict)
    
    return {"id": item.id, "message": "Storage item created successfully"}

@router.put("/items/{item_id}")
async def update_storage_item(
    item_id: str,
    item_data: StorageItemUpdate,
    current_admin: dict = Depends(get_current_admin)
):
    """Update storage item"""
    item = await storage_collection.find_one({"id": item_id})
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Storage item not found"
        )
    
    if current_admin['role'] != 'super_admin' and item['created_by'] != current_admin['username']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    update_data = {"updated_at": datetime.utcnow().isoformat()}
    if item_data.title is not None:
        update_data['title'] = item_data.title
    if item_data.content is not None:
        update_data['content'] = item_data.content
    if item_data.type is not None:
        update_data['type'] = item_data.type
    if item_data.fileUrl is not None:
        update_data['fileUrl'] = item_data.fileUrl
    if item_data.fileName is not None:
        update_data['fileName'] = item_data.fileName
    if item_data.tags is not None:
        update_data['tags'] = item_data.tags
    if item_data.visibleTo is not None:
        update_data['visibleTo'] = item_data.visibleTo
    
    await storage_collection.update_one(
        {"id": item_id},
        {"$set": update_data}
    )
    
    return {"message": "Storage item updated successfully"}

@router.delete("/items/{item_id}")
async def delete_storage_item(
    item_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete storage item and unlinks corresponding file on disk"""
    item = await storage_collection.find_one({"id": item_id})
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Storage item not found"
        )
    
    if current_admin['role'] != 'super_admin' and item['created_by'] != current_admin['username']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Securely delete physical file on disk if stored locally
    file_url = item.get("fileUrl", "")
    if file_url and "/files/" in file_url:
        stored_fname = file_url.split("/files/")[-1]
        phys_path = UPLOAD_DIR / stored_fname
        if phys_path.exists() and str(phys_path.resolve()).startswith(str(UPLOAD_DIR.resolve())):
            try:
                os.remove(phys_path)
            except Exception:
                pass
    
    await storage_collection.delete_one({"id": item_id})
    return {"message": "Storage item and associated file deleted successfully"}

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_admin: dict = Depends(get_current_admin)
):
    """Upload file for storage with strict validation and size bounds"""
    if not check_permission(current_admin, 'canAccessPrivateStorage') and current_admin['role'] != 'super_admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Validate extension, magic bytes, and safe name
    ext, safe_name = validate_file_security(file)
    file_id, file_path = generate_secure_path(UPLOAD_DIR, ext)
    
    # Save file in streaming chunks to enforce size limit safely
    total_size = 0
    try:
        with open(file_path, "wb") as buffer:
            while chunk := file.file.read(65536):
                total_size += len(chunk)
                if total_size > MAX_FILE_SIZE_BYTES:
                    buffer.close()
                    if file_path.exists():
                        os.remove(file_path)
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="File exceeds maximum allowed size of 15MB."
                    )
                buffer.write(chunk)
        
        file_url = f"/api/storage/files/{file_id}{ext}"
        return {
            "url": file_url,
            "filename": safe_name,
            "size": total_size
        }
    except HTTPException:
        raise
    except Exception as e:
        if file_path.exists():
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File upload failed: {str(e)}"
        )

@router.get("/files/{filename}")
async def get_storage_file(
    filename: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Authenticated file retrieval for storage items with role and ownership checks"""
    clean_name = sanitize_filename(filename)
    target_path = (UPLOAD_DIR / clean_name).resolve()
    
    if not str(target_path).startswith(str(UPLOAD_DIR.resolve())):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid path")
    
    # 1. Permission check: require super_admin or canAccessStorage permission
    if current_admin['role'] != 'super_admin' and not check_permission(current_admin, 'canAccessStorage'):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access storage. Contact super admin."
        )

    if not target_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    # 2. Ownership / Visibility check if linked to a storage item
    item = await storage_collection.find_one({"fileUrl": {"$regex": f"{clean_name}$"}})
    if item and current_admin['role'] != 'super_admin':
        visible_to = item.get("visibleTo", [])
        creator = item.get("created_by")
        username = current_admin.get("username")
        if visible_to and (username != creator and username not in visible_to):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: You do not have visibility permissions for this private file."
            )
    
    return FileResponse(path=str(target_path), filename=clean_name)
