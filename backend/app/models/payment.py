from app.extensions import db
from datetime import datetime
import uuid


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = db.Column(db.String(36), db.ForeignKey('bookings.id', ondelete='SET NULL'), nullable=True, index=True)
    patient_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True)
    nurse_id = db.Column(db.String(36), db.ForeignKey('nurses.id', ondelete='SET NULL'), nullable=True)

    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='INR')
    platform_fee = db.Column(db.Numeric(10, 2), default=0)
    nurse_payout = db.Column(db.Numeric(10, 2), default=0)

    status = db.Column(db.String(30), default='PENDING', nullable=False)
    # PENDING, SUCCEEDED, FAILED, REFUNDED, PARTIALLY_REFUNDED

    payment_method = db.Column(db.String(30), nullable=True)  # CARD, UPI, NETBANKING, WALLET
    stripe_payment_intent_id = db.Column(db.String(128), unique=True, nullable=True)
    stripe_charge_id = db.Column(db.String(128), nullable=True)
    stripe_transfer_id = db.Column(db.String(128), nullable=True)
    refund_id = db.Column(db.String(128), nullable=True)
    refund_amount = db.Column(db.Numeric(10, 2), nullable=True)
    refund_reason = db.Column(db.Text, nullable=True)
    refunded_at = db.Column(db.DateTime, nullable=True)

    metadata_ = db.Column('metadata', db.JSON, default={})
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'patient_id': self.patient_id,
            'nurse_id': self.nurse_id,
            'amount': float(self.amount),
            'currency': self.currency,
            'platform_fee': float(self.platform_fee),
            'nurse_payout': float(self.nurse_payout),
            'status': self.status,
            'payment_method': self.payment_method,
            'stripe_payment_intent_id': self.stripe_payment_intent_id,
            'refund_amount': float(self.refund_amount) if self.refund_amount else None,
            'refund_reason': self.refund_reason,
            'refunded_at': self.refunded_at.isoformat() if self.refunded_at else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
