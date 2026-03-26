from app.extensions import db
from datetime import datetime
import uuid


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = db.Column(db.String(36), db.ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False, unique=True)
    nurse_id = db.Column(db.String(36), db.ForeignKey('nurses.id', ondelete='CASCADE'), nullable=False, index=True)
    patient_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)

    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text, nullable=True)
    tags = db.Column(db.JSON, default=[])  # ['punctual', 'professional', 'gentle', etc.]

    is_visible = db.Column(db.Boolean, default=True)
    nurse_reply = db.Column(db.Text, nullable=True)
    nurse_replied_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    patient = db.relationship('User', foreign_keys=[patient_id], backref='reviews')

    def to_dict(self, include_patient=False):
        data = {
            'id': self.id,
            'booking_id': self.booking_id,
            'nurse_id': self.nurse_id,
            'patient_id': self.patient_id,
            'rating': self.rating,
            'comment': self.comment,
            'tags': self.tags,
            'is_visible': self.is_visible,
            'nurse_reply': self.nurse_reply,
            'nurse_replied_at': self.nurse_replied_at.isoformat() if self.nurse_replied_at else None,
            'created_at': self.created_at.isoformat(),
        }
        if include_patient and self.patient:
            data['patient'] = self.patient.to_dict()
        return data
