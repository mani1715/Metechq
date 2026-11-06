import time
from collections import defaultdict
from threading import Lock
from typing import Optional, Tuple

class InMemoryRateLimiter:
    """Thread-safe sliding-window in-memory rate limiter"""
    def __init__(self):
        self._lock = Lock()
        self._attempts = defaultdict(list)
    
    def check_rate_limit(self, key: str, max_attempts: int, window_seconds: int) -> Tuple[bool, int]:
        """
        Check if an action is permitted under the rate limit.
        Returns: (is_allowed: bool, retry_after_seconds: int)
        """
        now = time.time()
        with self._lock:
            # Filter attempts inside the active window
            valid_attempts = [t for t in self._attempts[key] if now - t < window_seconds]
            self._attempts[key] = valid_attempts
            
            if len(valid_attempts) >= max_attempts:
                oldest_in_window = valid_attempts[0]
                retry_after = int(window_seconds - (now - oldest_in_window)) + 1
                return False, max(1, retry_after)
            
            return True, 0
    
    def record_attempt(self, key: str):
        """Record an attempt timestamp"""
        now = time.time()
        with self._lock:
            self._attempts[key].append(now)
    
    def reset(self, key: str):
        """Reset attempts for a key (e.g. after successful login)"""
        with self._lock:
            if key in self._attempts:
                del self._attempts[key]

# Global instances for authentication and API endpoints
login_rate_limiter = InMemoryRateLimiter()
public_api_limiter = InMemoryRateLimiter()
