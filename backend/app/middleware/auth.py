from functools import wraps
from flask import request, jsonify, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.extensions import db
from app.models.user import User
import logging

logger = logging.getLogger(__name__)


def require_auth(f):
    """Decorator: validates JWT and attaches current user to g.current_user."""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = db.session.get(User, user_id)
            if not user or not user.is_active:
                return jsonify({
                    'success': False,
                    'message': 'User not found or inactive',
                    'data': None
                }), 401
            g.current_user = user
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'data': None
            }), 401
        return f(*args, **kwargs)
    return decorated


def require_role(*roles):
    """Decorator: ensures the authenticated user has one of the required roles."""
    def decorator(f):
        @wraps(f)
        @require_auth
        def decorated(*args, **kwargs):
            if g.current_user.role not in roles:
                return jsonify({
                    'success': False,
                    'message': 'Insufficient permissions',
                    'data': None
                }), 403
            return f(*args, **kwargs)
        return decorated
    return decorator


def optional_auth(f):
    """Decorator: attaches current user if JWT present, otherwise g.current_user = None."""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
            if user_id:
                g.current_user = db.session.get(User, user_id)
            else:
                g.current_user = None
        except Exception:
            g.current_user = None
        return f(*args, **kwargs)
    return decorated
