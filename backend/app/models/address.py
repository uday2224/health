from app.extensions import db
from datetime import datetime
import uuid

class Address(db.Model):
    __tablename__ = 'addresses'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    label = db.Column(db.String(50), nullable=True)  # Home, Work, Other
    house_no = db.Column(db.String(100), nullable=True)
    street = db.Column(db.Text, nullable=True)
    landmark = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    pincode = db.Column(db.String(10), nullable=True)
    lat = db.Column(db.Numeric(10, 8), nullable=True)
    lng = db.Column(db.Numeric(11, 8), nullable=True)
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'label': self.label,
            'house_no': self.house_no,
            'street': self.street,
            'landmark': self.landmark,
            'city': self.city,
            'pincode': self.pincode,
            'lat': float(self.lat) if self.lat else None,
            'lng': float(self.lng) if self.lng else None,
            'is_default': self.is_default
        }
