from app.extensions import db
from datetime import datetime
import uuid


class Prescription(db.Model):
    __tablename__ = 'prescriptions'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    doctor_id = db.Column(db.String(36), db.ForeignKey('doctors.id', ondelete='SET NULL'), nullable=True)
    consultation_id = db.Column(db.String(36), nullable=True)

    image_url = db.Column(db.Text, nullable=True)
    raw_text = db.Column(db.Text, nullable=True)
    parsed_data = db.Column(db.JSON, default={})  # Structured data extracted by Claude Vision
    medications = db.Column(db.JSON, default=[])  # List of {name, dosage, frequency, duration}
    instructions = db.Column(db.Text, nullable=True)
    diagnosis = db.Column(db.Text, nullable=True)

    is_verified = db.Column(db.Boolean, default=False)
    verified_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    verified_at = db.Column(db.DateTime, nullable=True)

    expiry_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bookings = db.relationship('Booking', backref='prescription', lazy=True,
                               foreign_keys='Booking.prescription_id')

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'doctor_id': self.doctor_id,
            'image_url': self.image_url,
            'raw_text': self.raw_text,
            'parsed_data': self.parsed_data,
            'medications': self.medications,
            'instructions': self.instructions,
            'diagnosis': self.diagnosis,
            'is_verified': self.is_verified,
            'verified_at': self.verified_at.isoformat() if self.verified_at else None,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
