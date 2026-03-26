from app.extensions import db
from datetime import datetime
import uuid

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = db.Column(db.String(15), unique=True, nullable=False, index=True)
    email = db.Column(db.String(255), unique=True, nullable=True)
    full_name = db.Column(db.String(255), nullable=False)
    avatar_url = db.Column(db.Text, nullable=True)
    role = db.Column(db.String(20), default='PATIENT', nullable=False)  # PATIENT, NURSE, ADMIN
    is_active = db.Column(db.Boolean, default=True)
    firebase_uid = db.Column(db.String(128), unique=True, nullable=True)
    stripe_customer_id = db.Column(db.String(64), nullable=True)
    blood_group = db.Column(db.String(5), nullable=True)
    allergies = db.Column(db.JSON, default=[])
    chronic_conditions = db.Column(db.JSON, default=[])
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    addresses = db.relationship('Address', backref='user', lazy=True, cascade='all, delete-orphan')
    nurse_profile = db.relationship('Nurse', foreign_keys='Nurse.user_id', backref='user', uselist=False, cascade='all, delete-orphan')
    bookings_as_patient = db.relationship('Booking', foreign_keys='Booking.patient_id', backref='patient', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'phone': self.phone,
            'email': self.email,
            'full_name': self.full_name,
            'avatar_url': self.avatar_url,
            'role': self.role,
            'is_active': self.is_active,
            'blood_group': self.blood_group,
            'allergies': self.allergies,
            'chronic_conditions': self.chronic_conditions,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
