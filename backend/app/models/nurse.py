from app.extensions import db
from datetime import datetime
import uuid

class Nurse(db.Model):
    __tablename__ = 'nurses'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    license_number = db.Column(db.String(100), unique=True, nullable=False)
    license_doc_url = db.Column(db.Text, nullable=True)
    id_proof_url = db.Column(db.Text, nullable=True)
    id_proof_type = db.Column(db.String(20), nullable=True)  # AADHAR, PAN
    specializations = db.Column(db.JSON, default=[])
    years_experience = db.Column(db.Integer, default=0)
    bio = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), default='PENDING_VERIFICATION')  # PENDING_VERIFICATION, ACTIVE, SUSPENDED, INACTIVE, REJECTED
    availability = db.Column(db.String(10), default='OFFLINE')  # ONLINE, OFFLINE
    avg_rating = db.Column(db.Numeric(3, 2), default=0.00)
    total_reviews = db.Column(db.Integer, default=0)
    total_bookings = db.Column(db.Integer, default=0)
    completion_rate = db.Column(db.Numeric(5, 2), default=0.00)
    stripe_connect_id = db.Column(db.String(64), nullable=True)
    rejection_reason = db.Column(db.Text, nullable=True)
    verified_at = db.Column(db.DateTime, nullable=True)
    verified_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bookings = db.relationship('Booking', backref='nurse', lazy=True)
    locations = db.relationship('NurseLocation', backref='nurse', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='nurse', lazy=True)
    
    def to_dict(self, include_user=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'license_number': self.license_number,
            'specializations': self.specializations,
            'years_experience': self.years_experience,
            'bio': self.bio,
            'status': self.status,
            'availability': self.availability,
            'avg_rating': float(self.avg_rating),
            'total_reviews': self.total_reviews,
            'total_bookings': self.total_bookings,
            'completion_rate': float(self.completion_rate),
            'verified_at': self.verified_at.isoformat() if self.verified_at else None,
            'created_at': self.created_at.isoformat()
        }
        if include_user and self.user:
            data['user'] = self.user.to_dict()
        return data
