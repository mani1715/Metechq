import os
import requests
from typing import Optional

BREVO_API_KEY = os.environ.get('BREVO_API_KEY', '')
BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@metechq.com')
BREVO_SENDER_EMAIL = os.environ.get('BREVO_SENDER_EMAIL', 'noreply@metechq.com')
BREVO_SENDER_NAME = os.environ.get('BREVO_SENDER_NAME', 'METECHQ')

def send_contact_email(name: str, email: str, message: str, phone: Optional[str] = None) -> bool:
    """Send contact form notification email via Brevo"""
    
    if not BREVO_API_KEY:
        print("Warning: BREVO_API_KEY not configured. Email not sent.")
        return False
    
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }
    
    phone_text = f"<p><strong>Phone:</strong> {phone}</p>" if phone else ""
    
    email_data = {
        "sender": {
            "name": BREVO_SENDER_NAME,
            "email": BREVO_SENDER_EMAIL
        },
        "to": [
            {
                "email": ADMIN_EMAIL,
                "name": "Admin"
            }
        ],
        "subject": f"New Contact Form Submission from {name}",
        "htmlContent": f"""
            <html>
                <body>
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    {phone_text}
                    <p><strong>Message:</strong></p>
                    <p>{message}</p>
                </body>
            </html>
        """,
        "replyTo": {
            "email": email,
            "name": name
        }
    }
    
    try:
        response = requests.post(BREVO_API_URL, json=email_data, headers=headers)
        response.raise_for_status()
        print(f"Email sent successfully to {ADMIN_EMAIL}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Failed to send email: {str(e)}")
        return False

def send_chat_notification(customer_name: str, customer_email: str, message: str) -> bool:
    """Send notification when customer sends a chat message"""
    
    if not BREVO_API_KEY:
        print("Warning: BREVO_API_KEY not configured. Email not sent.")
        return False
    
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }
    
    email_data = {
        "sender": {
            "name": BREVO_SENDER_NAME,
            "email": BREVO_SENDER_EMAIL
        },
        "to": [
            {
                "email": ADMIN_EMAIL,
                "name": "Admin"
            }
        ],
        "subject": f"New Chat Message from {customer_name}",
        "htmlContent": f"""
            <html>
                <body>
                    <h2>New Chat Message</h2>
                    <p><strong>From:</strong> {customer_name} ({customer_email})</p>
                    <p><strong>Message:</strong></p>
                    <p>{message}</p>
                    <p><a href="{os.environ.get('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')}/admin/dashboard?tab=chat">View in Admin Panel</a></p>
                </body>
            </html>
        """
    }
    
    try:
        response = requests.post(BREVO_API_URL, json=email_data, headers=headers)
        response.raise_for_status()
        print(f"Chat notification sent to {ADMIN_EMAIL}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Failed to send chat notification: {str(e)}")
        return False

async def send_booking_notification(booking_data: dict) -> bool:
    """Send notification when a new booking is created"""
    
    if not BREVO_API_KEY:
        print("Warning: BREVO_API_KEY not configured. Email not sent.")
        return False
    
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }
    
    message_text = f"<p><strong>Message:</strong> {booking_data.get('message')}</p>" if booking_data.get('message') else ""
    
    email_data = {
        "sender": {
            "name": BREVO_SENDER_NAME,
            "email": BREVO_SENDER_EMAIL
        },
        "to": [
            {
                "email": ADMIN_EMAIL,
                "name": "Admin"
            }
        ],
        "subject": f"New Consultation Booking from {booking_data.get('name')}",
        "htmlContent": f"""
            <html>
                <body>
                    <h2>New Consultation Booking Request</h2>
                    <p><strong>Name:</strong> {booking_data.get('name')}</p>
                    <p><strong>Email:</strong> {booking_data.get('email')}</p>
                    <p><strong>Phone:</strong> {booking_data.get('phone')}</p>
                    <p><strong>Preferred Date:</strong> {booking_data.get('preferred_date')}</p>
                    <p><strong>Preferred Time:</strong> {booking_data.get('preferred_time_slot')}</p>
                    <p><strong>Meeting Type:</strong> {booking_data.get('meeting_type')}</p>
                    {message_text}
                    <p><strong>Status:</strong> Pending</p>
                    <hr>
                    <p><a href="{os.environ.get('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')}/admin/bookings">Manage Bookings</a></p>
                </body>
            </html>
        """,
        "replyTo": {
            "email": booking_data.get('email'),
            "name": booking_data.get('name')
        }
    }
    
    try:
        response = requests.post(BREVO_API_URL, json=email_data, headers=headers)
        response.raise_for_status()
        print(f"Booking notification sent to {ADMIN_EMAIL}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Failed to send booking notification: {str(e)}")
        return False
