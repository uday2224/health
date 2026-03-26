from app.extensions import db
from datetime import datetime
import uuid


class Consultation(db.Model):
    __tablename__ = 'consultations'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    doctor_id = db.Column(db.String(36), db.ForeignKey('doctors.id', ondelete='SET NULL'), nullable=True, index=True)

    type = db.Column(db.String(20), default='TELECONSULT')  # TELECONSULT, IN_PERSON, CHAT
    status = db.Column(db.String(20), default='SCHEDULED', nullable=False)
    # SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW

    scheduled_at = db.Column(db.DateTime, nullable=True)
    started_at = db.Column(db.DateTime, nullable=True)
    ended_at = db.Column(db.DateTime, nullable=True)

    chief_complaint = db.Column(db.Text, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    diagnosis = db.Column(db.Text, nullable=True)
    prescription_id = db.Column(db.String(36), db.ForeignKey('prescriptions.id'), nullable=True)

    amount = db.Column(db.Numeric(10, 2), nullable=True)
    payment_status = db.Column(db.String(20), default='PENDING')

    room_id = db.Column(db.String(128), nullable=True)  # Video/chat room identifier
    recording_url = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'doctor_id': self.doctor_id,
            'type': self.type,
            'status': self.status,
            'scheduled_at': self.scheduled_at.isoformat() if self.scheduled_at else None,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'ended_at': self.ended_at.isoformat() if self.ended_at else None,
            'chief_complaint': self.chief_complaint,
            'notes': self.notes,
            'diagnosis': self.diagnosis,
            'prescription_id': self.prescription_id,
            'amount': float(self.amount) if self.amount else None,
            'payment_status': self.payment_status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
