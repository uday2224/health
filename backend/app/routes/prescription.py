from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import time
from app.extensions import db
from app.models.prescription import Prescription
from app.services.cloudinary_service import upload_image
from app.services.vision_service import parse_prescription_from_bytes, parse_prescription_from_url
from app.utils.response import success_response, error_response, paginate
import logging

logger = logging.getLogger(__name__)

prescription_bp = Blueprint('prescriptions', __name__, url_prefix='/api/prescriptions')

_ALLOWED_MIME_TYPES = {'image/jpeg', 'image/png', 'image/webp', 'image/gif'}


@prescription_bp.route('', methods=['POST'])
@jwt_required()
def upload_prescription():
    """Upload a prescription image, parse it with Claude Vision, and save the record.

    Accepts ``multipart/form-data`` with a single ``file`` field.
    Optionally accepts ``doctor_id`` and ``consultation_id`` form fields.
    """
    user_id = get_jwt_identity()

    if 'file' not in request.files:
        return error_response('No file provided', status_code=400)

    file = request.files['file']
    if not file.filename:
        return error_response('Empty filename', status_code=400)

    mime_type = file.mimetype or 'image/jpeg'
    if mime_type not in _ALLOWED_MIME_TYPES:
        return error_response(
            f'Unsupported file type: {mime_type}. Allowed: jpeg, png, webp, gif',
            status_code=415,
        )

    # Read bytes before the file stream is consumed by Cloudinary upload
    image_bytes = file.read()
    file.seek(0)

    # 1. Upload to Cloudinary for persistent storage
    try:
        cloud_result = upload_image(
            file,
            folder='prescriptions',
            public_id=f'prescription_{user_id}_{int(time.time())}',
        )
        image_url = cloud_result['secure_url']
    except Exception as e:
        logger.error('Cloudinary upload failed for prescription: %s', e)
        return error_response('Image upload failed', status_code=500)

    # 2. Parse the image with Claude Vision
    try:
        parsed = parse_prescription_from_bytes(image_bytes, media_type=mime_type)
    except Exception as e:
        logger.warning('Vision parsing failed (prescription saved without OCR): %s', e)
        parsed = {}

    # 3. Persist the prescription record
    prescription = Prescription(
        patient_id=user_id,
        doctor_id=request.form.get('doctor_id'),
        consultation_id=request.form.get('consultation_id'),
        image_url=image_url,
        raw_text=parsed.get('raw_text'),
        parsed_data=parsed,
        medications=parsed.get('medications') or [],
        instructions=parsed.get('instructions'),
        diagnosis=parsed.get('diagnosis'),
    )
    db.session.add(prescription)
    db.session.commit()

    return success_response(
        data=prescription.to_dict(),
        message='Prescription uploaded and parsed successfully',
        status_code=201,
    )


@prescription_bp.route('', methods=['GET'])
@jwt_required()
def list_prescriptions():
    """Return a paginated list of the current user's prescriptions."""
    user_id = get_jwt_identity()
    page = request.args.get('page', 1)
    per_page = request.args.get('per_page', 20)

    query = (
        Prescription.query
        .filter_by(patient_id=user_id)
        .order_by(Prescription.created_at.desc())
    )
    items, pagination = paginate(query, page, per_page)
    return success_response(data=[p.to_dict() for p in items], pagination=pagination)


@prescription_bp.route('/<prescription_id>', methods=['GET'])
@jwt_required()
def get_prescription(prescription_id):
    """Return a single prescription owned by the current user."""
    user_id = get_jwt_identity()
    prescription = Prescription.query.filter_by(
        id=prescription_id, patient_id=user_id
    ).first()
    if not prescription:
        return error_response('Prescription not found', status_code=404)
    return success_response(data=prescription.to_dict())


@prescription_bp.route('/<prescription_id>/reparse', methods=['POST'])
@jwt_required()
def reparse_prescription(prescription_id):
    """Re-run Claude Vision on an existing prescription's image URL."""
    user_id = get_jwt_identity()
    prescription = Prescription.query.filter_by(
        id=prescription_id, patient_id=user_id
    ).first()
    if not prescription:
        return error_response('Prescription not found', status_code=404)
    if not prescription.image_url:
        return error_response('Prescription has no image to parse', status_code=400)

    try:
        parsed = parse_prescription_from_url(prescription.image_url)
    except Exception as e:
        logger.error('Re-parse failed for prescription %s: %s', prescription_id, e)
        return error_response('Vision parsing failed', status_code=500)

    prescription.raw_text = parsed.get('raw_text', prescription.raw_text)
    prescription.parsed_data = parsed
    prescription.medications = parsed.get('medications') or prescription.medications
    prescription.instructions = parsed.get('instructions', prescription.instructions)
    prescription.diagnosis = parsed.get('diagnosis', prescription.diagnosis)
    db.session.commit()

    return success_response(data=prescription.to_dict(), message='Prescription reparsed successfully')


@prescription_bp.route('/<prescription_id>', methods=['DELETE'])
@jwt_required()
def delete_prescription(prescription_id):
    """Delete a prescription owned by the current user."""
    user_id = get_jwt_identity()
    prescription = Prescription.query.filter_by(
        id=prescription_id, patient_id=user_id
    ).first()
    if not prescription:
        return error_response('Prescription not found', status_code=404)

    db.session.delete(prescription)
    db.session.commit()
    return success_response(message='Prescription deleted')
