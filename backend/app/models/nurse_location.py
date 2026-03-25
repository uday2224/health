from app.extensions import db
from datetime import datetime
import uuid


class NurseLocation(db.Model):
    __tablename__ = 'nurse_locations'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nurse_id = db.Column(db.String(36), db.ForeignKey('nurses.id', ondelete='CASCADE'), nullable=False, index=True)
    booking_id = db.Column(db.String(36), db.ForeignKey('bookings.id', ondelete='SET NULL'), nullable=True)

    lat = db.Column(db.Numeric(10, 8), nullable=False)
    lng = db.Column(db.Numeric(11, 8), nullable=False)
    accuracy = db.Column(db.Numeric(8, 2), nullable=True)
    heading = db.Column(db.Numeric(6, 2), nullable=True)  # degrees 0-360
    speed = db.Column(db.Numeric(8, 2), nullable=True)  # km/h

    recorded_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'nurse_id': self.nurse_id,
            'booking_id': self.booking_id,
            'lat': float(self.lat),
            'lng': float(self.lng),
            'accuracy': float(self.accuracy) if self.accuracy else None,
            'heading': float(self.heading) if self.heading else None,
            'speed': float(self.speed) if self.speed else None,
            'recorded_at': self.recorded_at.isoformat(),
        }
