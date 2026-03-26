from app.extensions import db
from datetime import datetime
import uuid


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    nurse_id = db.Column(db.String(36), db.ForeignKey('nurses.id', ondelete='SET NULL'), nullable=True, index=True)
    address_id = db.Column(db.String(36), db.ForeignKey('addresses.id', ondelete='SET NULL'), nullable=True)

    service_type = db.Column(db.String(50), nullable=False)  # INJECTION, WOUND_CARE, IV_DRIP, etc.
    status = db.Column(db.String(30), default='PENDING', nullable=False, index=True)
    # PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, EXPIRED

    scheduled_at = db.Column(db.DateTime, nullable=True)
    started_at = db.Column(db.DateTime, nullable=True)
    completed_at = db.Column(db.DateTime, nullable=True)
    cancelled_at = db.Column(db.DateTime, nullable=True)
    cancellation_reason = db.Column(db.Text, nullable=True)
    cancelled_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)

    notes = db.Column(db.Text, nullable=True)
    special_instructions = db.Column(db.Text, nullable=True)
    base_price = db.Column(db.Numeric(10, 2), nullable=True)
    platform_fee = db.Column(db.Numeric(10, 2), nullable=True)
    total_price = db.Column(db.Numeric(10, 2), nullable=True)

    prescription_id = db.Column(db.String(36), db.ForeignKey('prescriptions.id'), nullable=True)
    is_emergency = db.Column(db.Boolean, default=False)
    subscription_id = db.Column(db.String(36), db.ForeignKey('subscriptions.id'), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    payments = db.relationship('Payment', backref='booking', lazy=True)
    review = db.relationship('Review', backref='booking', uselist=False, lazy=True)

    def to_dict(self, include_nurse=False, include_patient=False):
        data = {
            'id': self.id,
            'patient_id': self.patient_id,
            'nurse_id': self.nurse_id,
            'address_id': self.address_id,
            'service_type': self.service_type,
            'status': self.status,
            'scheduled_at': self.scheduled_at.isoformat() if self.scheduled_at else None,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'cancelled_at': self.cancelled_at.isoformat() if self.cancelled_at else None,
            'cancellation_reason': self.cancellation_reason,
            'notes': self.notes,
            'special_instructions': self.special_instructions,
            'base_price': float(self.base_price) if self.base_price else None,
            'platform_fee': float(self.platform_fee) if self.platform_fee else None,
            'total_price': float(self.total_price) if self.total_price else None,
            'is_emergency': self.is_emergency,
            'prescription_id': self.prescription_id,
            'subscription_id': self.subscription_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
        if include_nurse and self.nurse:
            data['nurse'] = self.nurse.to_dict(include_user=True)
        if include_patient and self.patient:
            data['patient'] = self.patient.to_dict()
        return data
