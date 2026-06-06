from . import db
import datetime

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # Nullable for automated system actions
    action = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    log_type = db.Column(db.String(50), default='Audit') # Audit, Alert, Status
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Relationship
    user = db.relationship('User', backref='activities')

    def to_dict(self):
        return {
            "id": self.id,
            "user": self.user.username if self.user else "System",
            "action": self.action,
            "description": self.description,
            "type": self.log_type,
            "timestamp": self.created_at.isoformat() # Return raw ISO format
        }