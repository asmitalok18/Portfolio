import os
import time
import hashlib
import logging
from django.core.cache import cache
from django.http import JsonResponse
from django.conf import settings
from rest_framework.views import exception_handler
from rest_framework.exceptions import Throttled

logger = logging.getLogger(__name__)

# Core Config
RATE_LIMIT_ENABLED = os.environ.get('RATE_LIMIT_ENABLED', 'true').lower() == 'true'
RATE_LIMIT_STORE = os.environ.get('RATE_LIMIT_STORE', 'redis')
RATE_LIMIT_FAIL_OPEN = os.environ.get('RATE_LIMIT_FAIL_OPEN', 'true').lower() == 'true'

# Limits
RATE_LIMIT_PUBLIC_WINDOW_MS = int(os.environ.get('RATE_LIMIT_PUBLIC_WINDOW_MS', 900000))
RATE_LIMIT_PUBLIC_MAX = int(os.environ.get('RATE_LIMIT_PUBLIC_MAX', 100))

RATE_LIMIT_AUTH_WINDOW_MS = int(os.environ.get('RATE_LIMIT_AUTH_WINDOW_MS', 900000))
RATE_LIMIT_AUTH_MAX = int(os.environ.get('RATE_LIMIT_AUTH_MAX', 10))

RATE_LIMIT_LOGIN_FAILED_MAX = int(os.environ.get('RATE_LIMIT_LOGIN_FAILED_MAX', 5))
RATE_LIMIT_LOGIN_BACKOFF_BASE_SECONDS = int(os.environ.get('RATE_LIMIT_LOGIN_BACKOFF_BASE_SECONDS', 30))
RATE_LIMIT_LOGIN_BACKOFF_MAX_SECONDS = int(os.environ.get('RATE_LIMIT_LOGIN_BACKOFF_MAX_SECONDS', 1800))

RATE_LIMIT_CONTACT_WINDOW_MS = int(os.environ.get('RATE_LIMIT_CONTACT_WINDOW_MS', 3600000))
RATE_LIMIT_CONTACT_MAX = int(os.environ.get('RATE_LIMIT_CONTACT_MAX', 5))

RATE_LIMIT_CHAT_ANONYMOUS_WINDOW_MS = int(os.environ.get('RATE_LIMIT_CHAT_ANONYMOUS_WINDOW_MS', 600000))
RATE_LIMIT_CHAT_ANONYMOUS_MAX = int(os.environ.get('RATE_LIMIT_CHAT_ANONYMOUS_MAX', 10))

RATE_LIMIT_CHAT_AUTHENTICATED_WINDOW_MS = int(os.environ.get('RATE_LIMIT_CHAT_AUTHENTICATED_WINDOW_MS', 600000))
RATE_LIMIT_CHAT_AUTHENTICATED_MAX = int(os.environ.get('RATE_LIMIT_CHAT_AUTHENTICATED_MAX', 30))

RATE_LIMIT_AUTHENTICATED_WINDOW_MS = int(os.environ.get('RATE_LIMIT_AUTHENTICATED_WINDOW_MS', 900000))
RATE_LIMIT_AUTHENTICATED_MAX = int(os.environ.get('RATE_LIMIT_AUTHENTICATED_MAX', 300))

RATE_LIMIT_EXPENSIVE_WINDOW_MS = int(os.environ.get('RATE_LIMIT_EXPENSIVE_WINDOW_MS', 3600000))
RATE_LIMIT_EXPENSIVE_MAX = int(os.environ.get('RATE_LIMIT_EXPENSIVE_MAX', 10))

def get_client_ip(request):
    real_ip = request.META.get('HTTP_X_REAL_IP')
    if real_ip:
        return real_ip.split(',')[0].strip()
        
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
        
    return request.META.get('REMOTE_ADDR', '')

def hash_identifier(identifier):
    if not identifier:
        return 'unknown'
    return hashlib.sha256(identifier.encode('utf-8')).hexdigest()

def execute_rate_limit(key, limit, window_ms):
    window_sec = window_ms // 1000
    try:
        # Initial set if not exists
        cache.add(key, 0, window_sec)
        # Increment
        count = cache.incr(key)
        if count > limit:
            return False, count
        return True, count
    except Exception as e:
        logger.error(f"Rate limit store error: {e}")
        if RATE_LIMIT_FAIL_OPEN:
            return True, 0
        return False, 0

def check_login_backoff(identifier):
    """
    Check if login is exponentially backed off.
    Returns (is_allowed, retry_after)
    """
    env = os.environ.get('DJANGO_ENV', 'production')
    hashed_id = hash_identifier(identifier)
    
    # Check if there is an active backoff block
    block_key = f"app:{env}:rate-limit:login_block:{hashed_id}"
    try:
        block_val = cache.get(block_key)
        if block_val:
            # We don't have accurate TTL from Django cache easily, so block_val stores the unblock timestamp
            current_time = time.time()
            if current_time < block_val:
                retry_after = int(block_val - current_time)
                return False, retry_after
    except Exception as e:
        logger.error(f"Rate limit store error: {e}")
        if not RATE_LIMIT_FAIL_OPEN:
            return False, 60
    return True, 0

def report_login_attempt(identifier, success):
    """
    Update backoff state based on login success/failure.
    """
    env = os.environ.get('DJANGO_ENV', 'production')
    hashed_id = hash_identifier(identifier)
    failures_key = f"app:{env}:rate-limit:login_failures:{hashed_id}"
    block_key = f"app:{env}:rate-limit:login_block:{hashed_id}"
    
    try:
        if success:
            cache.delete(failures_key)
            cache.delete(block_key)
        else:
            # Increment failure count (store up to 1 hour max for state)
            cache.add(failures_key, 0, 3600)
            failures = cache.incr(failures_key)
            
            if failures >= RATE_LIMIT_LOGIN_FAILED_MAX:
                # Calculate exponential backoff
                # e.g. base * 2 ^ (failures - max)
                multiplier = 2 ** (failures - RATE_LIMIT_LOGIN_FAILED_MAX)
                backoff_sec = RATE_LIMIT_LOGIN_BACKOFF_BASE_SECONDS * multiplier
                backoff_sec = min(backoff_sec, RATE_LIMIT_LOGIN_BACKOFF_MAX_SECONDS)
                
                # Set block
                cache.set(block_key, time.time() + backoff_sec, backoff_sec)
    except Exception as e:
        logger.error(f"Rate limit store error: {e}")

def get_standard_429_response(retry_after):
    response = JsonResponse({
        "success": False,
        "error": {
            "code": "RATE_LIMIT_EXCEEDED",
            "message": f"Too many requests. Please try again in {retry_after} seconds.",
            "retryAfter": retry_after
        }
    }, status=429)
    response['Retry-After'] = str(retry_after)
    response['RateLimit-Limit'] = '0' # Contextual
    response['RateLimit-Remaining'] = '0'
    response['RateLimit-Reset'] = str(retry_after)
    return response

class RateLimitMiddleware:
    """
    Middleware for rate-limiting API endpoints based on category.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not RATE_LIMIT_ENABLED or not request.path.startswith('/api/'):
            return self.get_response(request)
        
        # Skip OPTIONS requests
        if request.method == 'OPTIONS':
            return self.get_response(request)

        # Route matching
        path = request.path
        
        # Normalize path to ignore trailing slash differences for matching
        norm_path = path if path.endswith('/') else path + '/'
        
        ip = get_client_ip(request)
        is_authenticated = request.user.is_authenticated if hasattr(request, 'user') else False
        
        limiter_type = None
        limit = 0
        window_ms = 0
        identifier = ip
        
        # 1. Login Endpoint
        if norm_path == '/api/auth/login/':
            # First check exponential backoff based on email/IP
            # For simplicity, we use IP if email isn't parsed yet, or parse from body
            email = ''
            if request.method == 'POST':
                try:
                    import json
                    body = json.loads(request.body)
                    email = body.get('username', '').strip().lower() # Django default auth usually uses username or email
                except:
                    pass
            
            check_id = f"{email}:{ip}" if email else ip
            allowed, retry_after = check_login_backoff(check_id)
            if not allowed:
                return get_standard_429_response(retry_after)
            
            limiter_type = 'auth'
            limit = RATE_LIMIT_AUTH_MAX
            window_ms = RATE_LIMIT_AUTH_WINDOW_MS
            identifier = ip # IP limit for general auth requests
            
        # 2. Chat Endpoint
        elif path.startswith('/api/chat/'):
            if is_authenticated:
                limiter_type = 'chat_auth'
                limit = RATE_LIMIT_CHAT_AUTHENTICATED_MAX
                window_ms = RATE_LIMIT_CHAT_AUTHENTICATED_WINDOW_MS
                identifier = str(request.user.id)
            else:
                limiter_type = 'chat_anon'
                limit = RATE_LIMIT_CHAT_ANONYMOUS_MAX
                window_ms = RATE_LIMIT_CHAT_ANONYMOUS_WINDOW_MS
                identifier = ip
                
        # 3. Authenticated Management Endpoints and authenticated auth routes
        elif norm_path.startswith('/api/manage/') or norm_path in ['/api/auth/logout/', '/api/auth/check/']:
            limiter_type = 'authenticated'
            limit = RATE_LIMIT_AUTHENTICATED_MAX
            window_ms = RATE_LIMIT_AUTHENTICATED_WINDOW_MS
            identifier = str(request.user.id) if is_authenticated else ip
            
        # 4. Contact Form Endpoint
        elif norm_path == '/api/contact/':
            limiter_type = 'contact'
            limit = RATE_LIMIT_CONTACT_MAX
            window_ms = RATE_LIMIT_CONTACT_WINDOW_MS
            identifier = ip
            
        # 5. RAG / Expensive Endpoints
        elif path.startswith('/api/rag/'):
            limiter_type = 'expensive'
            limit = RATE_LIMIT_EXPENSIVE_MAX
            window_ms = RATE_LIMIT_EXPENSIVE_WINDOW_MS
            identifier = str(request.user.id) if is_authenticated else ip
            
        # 5. Public GET Data APIs
        else:
            limiter_type = 'public'
            limit = RATE_LIMIT_PUBLIC_MAX
            window_ms = RATE_LIMIT_PUBLIC_WINDOW_MS
            identifier = ip

        if limiter_type:
            env = os.environ.get('DJANGO_ENV', 'production')
            hashed_id = hash_identifier(identifier)
            key = f"app:{env}:rate-limit:{limiter_type}:{hashed_id}"
            
            allowed, count = execute_rate_limit(key, limit, window_ms)
            if not allowed:
                retry_after = window_ms // 1000
                response = get_standard_429_response(retry_after)
                response['RateLimit-Limit'] = str(limit)
                response['RateLimit-Remaining'] = '0'
                return response
        
        # Call next middleware / view
        response = self.get_response(request)
        
        # Post-process for Login to track success/failure
        if norm_path == '/api/auth/login/' and request.method == 'POST':
            if response.status_code == 200:
                report_login_attempt(check_id, True)
            elif response.status_code == 401:
                report_login_attempt(check_id, False)
            
        return response
