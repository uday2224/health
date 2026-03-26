from app.extensions import db
from datetime import datetime
import uuid


class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id = db.Column(db.String(36), db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True)
    actor_role = db.Column(db.String(20), nullable=True)

    action = db.Column(db.String(100), nullable=False)  # e.g. 'NURSE_VERIFIED', 'BOOKING_CANCELLED'
    resource_type = db.Column(db.String(50), nullable=True)  # e.g. 'Nurse', 'Booking'
    resource_id = db.Column(db.String(36), nullable=True)

    before = db.Column(db.JSON, nullable=True)
    after = db.Column(db.JSON, nullable=True)
    metadata_ = db.Column('metadata', db.JSON, default={})

    ip_address = db.Column(db.String(45), nullable=True)
    user_agent = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'actor_id': self.actor_id,
            'actor_role': self.actor_role,
            'action': self.action,
            'resource_type': self.resource_type,
            'resource_id': self.resource_id,
            'before': self.before,
            'after': self.after,
            'ip_address': self.ip_address,
            'created_at': self.created_at.isoformat(),
        }
