import json
import logging
from app.extensions import redis_client

logger = logging.getLogger(__name__)

OTP_TTL = 300  # 5 minutes


def store_otp(phone: str, otp: str, ttl: int = OTP_TTL) -> bool:
    """Store an OTP for a phone number with a TTL (seconds)."""
    key = f'otp:{phone}'
    try:
        redis_client.setex(key, ttl, otp)
        return True
    except Exception as e:
        logger.error('Redis store_otp error: %s', e)
        return False


def verify_otp(phone: str, otp: str) -> bool:
    """Verify the OTP for a phone number. Deletes it if valid."""
    key = f'otp:{phone}'
    try:
        stored = redis_client.get(key)
        if stored and stored == otp:
            redis_client.delete(key)
            return True
        return False
    except Exception as e:
        logger.error('Redis verify_otp error: %s', e)
        return False


def cache_set(key: str, value, ttl: int = 3600) -> bool:
    """Cache a JSON-serializable value."""
    try:
        redis_client.setex(key, ttl, json.dumps(value))
        return True
    except Exception as e:
        logger.error('Redis cache_set error: %s', e)
        return False


def cache_get(key: str):
    """Retrieve a cached value. Returns None if not found."""
    try:
        raw = redis_client.get(key)
        return json.loads(raw) if raw else None
    except Exception as e:
        logger.error('Redis cache_get error: %s', e)
        return None


def cache_delete(key: str) -> bool:
    """Delete a cached value."""
    try:
        redis_client.delete(key)
        return True
    except Exception as e:
        logger.error('Redis cache_delete error: %s', e)
        return False
