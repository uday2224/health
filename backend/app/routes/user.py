from flask import Blueprint, request, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.extensions import db
from app.models.user import User
from app.models.address import Address
from app.models.notification import Notification
from app.services.cloudinary_service import upload_image
from app.utils.response import success_response, error_response, paginate
import logging

logger = logging.getLogger(__name__)

user_bp = Blueprint('user', __name__, url_prefix='/api/user')


@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return error_response('User not found', status_code=404)
    return success_response(data=user.to_dict())


@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return error_response('User not found', status_code=404)

    data = request.get_json(silent=True) or {}
    allowed = ['full_name', 'email', 'blood_group', 'allergies', 'chronic_conditions']
    for field in allowed:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return success_response(data=user.to_dict(), message='Profile updated')


@user_bp.route('/addresses', methods=['GET'])
@jwt_required()
def get_addresses():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return error_response('User not found', status_code=404)
    addresses = [a.to_dict() for a in user.addresses]
    return success_response(data=addresses)


@user_bp.route('/addresses', methods=['POST'])
@jwt_required()
def add_address():
    user_id = get_jwt_identity()
    data = request.get_json(silent=True) or {}

    if data.get('is_default'):
        Address.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})

    address = Address(
        user_id=user_id,
        label=data.get('label'),
        house_no=data.get('house_no'),
        street=data.get('street'),
        landmark=data.get('landmark'),
        city=data.get('city'),
        pincode=data.get('pincode'),
        lat=data.get('lat'),
        lng=data.get('lng'),
        is_default=data.get('is_default', False),
    )
    db.session.add(address)
    db.session.commit()
    return success_response(data=address.to_dict(), message='Address added', status_code=201)


@user_bp.route('/addresses/<address_id>', methods=['PUT'])
@jwt_required()
def update_address(address_id):
    user_id = get_jwt_identity()
    address = Address.query.filter_by(id=address_id, user_id=user_id).first()
    if not address:
        return error_response('Address not found', status_code=404)

    data = request.get_json(silent=True) or {}
    if data.get('is_default'):
        Address.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})

    allowed = ['label', 'house_no', 'street', 'landmark', 'city', 'pincode', 'lat', 'lng', 'is_default']
    for field in allowed:
        if field in data:
            setattr(address, field, data[field])

    db.session.commit()
    return success_response(data=address.to_dict(), message='Address updated')


@user_bp.route('/addresses/<address_id>', methods=['DELETE'])
@jwt_required()
def delete_address(address_id):
    user_id = get_jwt_identity()
    address = Address.query.filter_by(id=address_id, user_id=user_id).first()
    if not address:
        return error_response('Address not found', status_code=404)

    db.session.delete(address)
    db.session.commit()
    return success_response(message='Address deleted')


@user_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1)
    per_page = request.args.get('per_page', 20)

    query = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc())
    items, pagination = paginate(query, page, per_page)

    return success_response(data=[n.to_dict() for n in items], pagination=pagination)


@user_bp.route('/notifications/read-all', methods=['POST'])
@jwt_required()
def mark_all_notifications_read():
    user_id = get_jwt_identity()
    Notification.query.filter_by(user_id=user_id, is_read=False).update({
        'is_read': True,
        'read_at': datetime.utcnow()
    })
    db.session.commit()
    return success_response(message='All notifications marked as read')


@user_bp.route('/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return error_response('User not found', status_code=404)

    if 'file' not in request.files:
        return error_response('No file provided', status_code=400)

    file = request.files['file']
    try:
        result = upload_image(file, folder='avatars', public_id=f'user_{user_id}')
        user.avatar_url = result['secure_url']
        db.session.commit()
        return success_response(data={'avatar_url': user.avatar_url}, message='Avatar updated')
    except Exception as e:
        logger.error('Avatar upload failed: %s', e)
        return error_response('Upload failed', status_code=500)
