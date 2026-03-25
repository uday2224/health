from app.extensions import db
from datetime import datetime
import uuid


class Subscription(db.Model):
    __tablename__ = 'subscriptions'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)

    plan = db.Column(db.String(20), nullable=False)  # WEEKLY, MONTHLY, QUARTERLY
    status = db.Column(db.String(20), default='ACTIVE', nullable=False)
    # ACTIVE, CANCELLED, EXPIRED, PAST_DUE, TRIALING

    stripe_subscription_id = db.Column(db.String(128), unique=True, nullable=True)
    stripe_price_id = db.Column(db.String(128), nullable=True)
    stripe_customer_id = db.Column(db.String(128), nullable=True)

    current_period_start = db.Column(db.DateTime, nullable=True)
    current_period_end = db.Column(db.DateTime, nullable=True)
    cancelled_at = db.Column(db.DateTime, nullable=True)
    cancel_at_period_end = db.Column(db.Boolean, default=False)

    bookings_used = db.Column(db.Integer, default=0)
    bookings_limit = db.Column(db.Integer, nullable=True)

    amount = db.Column(db.Numeric(10, 2), nullable=True)
    currency = db.Column(db.String(3), default='INR')

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bookings = db.relationship('Booking', backref='subscription', lazy=True,
                               foreign_keys='Booking.subscription_id')

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'plan': self.plan,
            'status': self.status,
            'current_period_start': self.current_period_start.isoformat() if self.current_period_start else None,
            'current_period_end': self.current_period_end.isoformat() if self.current_period_end else None,
            'cancelled_at': self.cancelled_at.isoformat() if self.cancelled_at else None,
            'cancel_at_period_end': self.cancel_at_period_end,
            'bookings_used': self.bookings_used,
            'bookings_limit': self.bookings_limit,
            'amount': float(self.amount) if self.amount else None,
            'currency': self.currency,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
