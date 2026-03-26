from app.extensions import db
from datetime import datetime
import uuid


class Doctor(db.Model):
    __tablename__ = 'doctors'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)

    license_number = db.Column(db.String(100), unique=True, nullable=False)
    specialization = db.Column(db.String(100), nullable=True)
    clinic_name = db.Column(db.String(255), nullable=True)
    clinic_address = db.Column(db.Text, nullable=True)
    consultation_fee = db.Column(db.Numeric(10, 2), nullable=True)
    available_for_teleconsult = db.Column(db.Boolean, default=True)
    bio = db.Column(db.Text, nullable=True)
    years_experience = db.Column(db.Integer, default=0)

    status = db.Column(db.String(20), default='PENDING_VERIFICATION', nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    consultations = db.relationship('Consultation', backref='doctor', lazy=True)
    prescriptions = db.relationship('Prescription', backref='doctor', lazy=True,
                                    foreign_keys='Prescription.doctor_id')

    def to_dict(self, include_user=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'license_number': self.license_number,
            'specialization': self.specialization,
            'clinic_name': self.clinic_name,
            'consultation_fee': float(self.consultation_fee) if self.consultation_fee else None,
            'available_for_teleconsult': self.available_for_teleconsult,
            'bio': self.bio,
            'years_experience': self.years_experience,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
        }
        if include_user and self.user:
            data['user'] = self.user.to_dict()
        return data
