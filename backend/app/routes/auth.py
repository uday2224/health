from flask import Blueprint, request, g
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from app.extensions import db
from app.models.user import User
from app.utils.response import success_response, error_response
import logging

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    """Verify Firebase phone OTP and return JWT tokens."""
    data = request.get_json(silent=True) or {}
    id_token = data.get('id_token')
    if not id_token:
        return error_response('id_token is required', status_code=400)

    try:
        from app.services.firebase_service import verify_firebase_token
        decoded = verify_firebase_token(id_token)
    except Exception as e:
        logger.warning('Firebase token verification failed: %s', e)
        return error_response('Invalid or expired token', status_code=401)

    phone = decoded.get('phone_number')
    firebase_uid = decoded.get('uid')

    if not phone:
        return error_response('Phone number not found in token', status_code=400)

    user = User.query.filter_by(phone=phone).first()
    is_new_user = user is None

    if is_new_user:
        user = User(phone=phone, firebase_uid=firebase_uid, full_name='')
        db.session.add(user)
        db.session.commit()

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return success_response(
        data={
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict(),
            'is_new_user': is_new_user,
        },
        message='OTP verified successfully',
        status_code=200,
    )


@auth_bp.route('/register-complete', methods=['POST'])
@jwt_required()
def register_complete():
    """Complete user registration with profile details."""
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return error_response('User not found', status_code=404)

    data = request.get_json(silent=True) or {}
    full_name = data.get('full_name', '').strip()
    if not full_name:
        return error_response('full_name is required', status_code=400)

    user.full_name = full_name
    if 'email' in data:
        user.email = data['email']
    if 'blood_group' in data:
        user.blood_group = data['blood_group']

    db.session.commit()
    return success_response(data=user.to_dict(), message='Profile updated')


@auth_bp.route('/refresh-token', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    """Issue a new access token using a valid refresh token."""
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return success_response(data={'access_token': access_token}, message='Token refreshed')


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout endpoint (client should discard tokens)."""
    return success_response(message='Logged out successfully')


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Return the current authenticated user's profile."""
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return error_response('User not found', status_code=404)
    return success_response(data=user.to_dict())
