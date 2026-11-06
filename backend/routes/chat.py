from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from schemas.chat import ChatMessageCreate, ChatReply
from database import conversations_collection
from auth.admin_auth import get_current_admin, check_permission
from models.chat import Conversation, ChatMessage
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/messages")
async def create_message(message_data: ChatMessageCreate):
    """Create new customer message (public endpoint for chat widget)"""
    try:
        # Validate input
        if not message_data.customer_email or not message_data.customer_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Name and email are required"
            )
        
        if not message_data.message or not message_data.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )
        
        # Limit message length
        if len(message_data.message) > 1000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message too long (max 1000 characters)"
            )
        
        # Find existing conversation by email
        conversation = await conversations_collection.find_one({
            "customer_email": message_data.customer_email
        })
        
        # Create new message
        new_message = ChatMessage(
            sender="customer",
            message=message_data.message.strip(),
            read=False
        )
        
        if conversation:
            # Add message to existing conversation
            message_dict = new_message.model_dump()
            message_dict['timestamp'] = message_dict['timestamp'].isoformat()
            
            await conversations_collection.update_one(
                {"id": conversation['id']},
                {
                    "$push": {"messages": message_dict},
                    "$inc": {"unread_count": 1},
                    "$set": {"last_message_at": datetime.utcnow().isoformat()}
                }
            )
            return {"success": True, "id": conversation['id'], "message": "Message sent successfully"}
        else:
            # Create new conversation
            new_conversation = Conversation(
                customer_name=message_data.customer_name,
                customer_email=message_data.customer_email,
                customer_phone=message_data.customer_phone or "",
                messages=[new_message],
                unread_count=1
            )
            
            conv_dict = new_conversation.model_dump()
            conv_dict['created_at'] = conv_dict['created_at'].isoformat()
            conv_dict['last_message_at'] = conv_dict['last_message_at'].isoformat()
            
            # Convert messages to dict
            conv_dict['messages'] = []
            for msg in new_conversation.messages:
                msg_dict = msg.model_dump()
                msg_dict['timestamp'] = msg_dict['timestamp'].isoformat()
                conv_dict['messages'].append(msg_dict)
            
            await conversations_collection.insert_one(conv_dict)
            return {"success": True, "id": new_conversation.id, "message": "Conversation started successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating message: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send message. Please try again."
        )

from utils.rate_limiter import public_api_limiter
from fastapi import Request

@router.get("/user-conversation")
async def get_user_conversation(email: str, request: Request, phone: Optional[str] = None):
    """Get user's conversation by email and phone with rate limiting"""
    try:
        client_ip = request.client.host if request.client else "unknown"
        allowed, retry_after = public_api_limiter.check_rate_limit(f"chat_fetch:{client_ip}", max_attempts=20, window_seconds=60)
        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Please wait {retry_after} seconds."
            )

        if not email or not email.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is required"
            )
        
        normalized_email = email.strip().lower()
        public_api_limiter.record_attempt(f"chat_fetch:{client_ip}")

        # Find conversation by email
        query = {"customer_email": {"$regex": f"^{normalized_email}$", "$options": "i"}}
        if phone and phone.strip():
            query["customer_phone"] = phone.strip()
        
        conversation = await conversations_collection.find_one(query)
        
        if not conversation:
            return {
                "success": False,
                "conversation": None,
                "message": "No conversation found"
            }
        
        return {
            "success": True,
            "conversation": {
                "id": conversation['id'],
                "customerName": conversation['customer_name'],
                "customerEmail": conversation['customer_email'],
                "customerPhone": conversation.get('customer_phone'),
                "messages": conversation['messages'],
                "lastMessageAt": conversation['last_message_at'],
                "createdAt": conversation['created_at']
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching conversation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch conversation"
        )

@router.get("/conversations")
async def get_conversations(current_admin: dict = Depends(get_current_admin)):
    """Get all conversations (admin only)"""
    if not check_permission(current_admin, 'canAccessChat') and current_admin['role'] != 'super_admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    conversations = await conversations_collection.find({}).sort("last_message_at", -1).to_list(length=1000)
    
    result = []
    total_unread = 0
    
    for conv in conversations:
        total_unread += conv.get('unread_count', 0)
        result.append({
            "id": conv['id'],
            "customerName": conv['customer_name'],
            "customerEmail": conv['customer_email'],
            "customerPhone": conv.get('customer_phone'),
            "messages": conv['messages'],
            "unreadCount": conv.get('unread_count', 0),
            "lastMessageAt": conv['last_message_at'],
            "createdAt": conv['created_at']
        })
    
    return {
        "success": True,
        "conversations": result,
        "totalUnread": total_unread
    }

@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Get specific conversation"""
    if not check_permission(current_admin, 'canAccessChat') and current_admin['role'] != 'super_admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    conversation = await conversations_collection.find_one({"id": conversation_id})
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    return {
        "id": conversation['id'],
        "customerName": conversation['customer_name'],
        "customerEmail": conversation['customer_email'],
        "customerPhone": conversation.get('customer_phone'),
        "messages": conversation['messages'],
        "unreadCount": conversation.get('unread_count', 0),
        "lastMessageAt": conversation['last_message_at'],
        "createdAt": conversation['created_at']
    }

@router.put("/conversations/{conversation_id}/read")
async def mark_as_read(
    conversation_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Mark conversation as read"""
    if not check_permission(current_admin, 'canAccessChat') and current_admin['role'] != 'super_admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    conversation = await conversations_collection.find_one({"id": conversation_id})
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    # Mark all customer messages as read
    messages = conversation['messages']
    for msg in messages:
        if msg['sender'] == 'customer':
            msg['read'] = True
    
    await conversations_collection.update_one(
        {"id": conversation_id},
        {
            "$set": {
                "messages": messages,
                "unread_count": 0
            }
        }
    )
    
    return {"message": "Marked as read"}

@router.post("/conversations/{conversation_id}/reply")
async def send_reply(
    conversation_id: str,
    reply_data: ChatReply,
    current_admin: dict = Depends(get_current_admin)
):
    """Send admin reply to conversation"""
    if not check_permission(current_admin, 'canAccessChat') and current_admin['role'] != 'super_admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    conversation = await conversations_collection.find_one({"id": conversation_id})
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    # Create admin reply message
    reply_message = ChatMessage(
        sender="admin",
        message=reply_data.message,
        read=True  # Admin messages are pre-read
    )
    
    reply_dict = reply_message.model_dump()
    reply_dict['timestamp'] = reply_dict['timestamp'].isoformat()
    
    await conversations_collection.update_one(
        {"id": conversation_id},
        {
            "$push": {"messages": reply_dict},
            "$set": {"last_message_at": datetime.utcnow().isoformat()}
        }
    )
    
    # Get updated conversation
    updated_conv = await conversations_collection.find_one({"id": conversation_id})
    
    return {
        "success": True,
        "conversation": {
            "id": updated_conv['id'],
            "customerName": updated_conv['customer_name'],
            "customerEmail": updated_conv['customer_email'],
            "customerPhone": updated_conv.get('customer_phone'),
            "messages": updated_conv['messages'],
            "unreadCount": updated_conv.get('unread_count', 0),
            "lastMessageAt": updated_conv['last_message_at']
        }
    }

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """Delete conversation"""
    if current_admin['role'] != 'super_admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admin can delete conversations"
        )
    
    result = await conversations_collection.delete_one({"id": conversation_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    return {"message": "Conversation deleted successfully"}
