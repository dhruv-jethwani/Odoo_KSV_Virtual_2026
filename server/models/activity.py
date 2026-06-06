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
        # Format time to look like "2 hours ago" or standard date
        now = datetime.datetime.utcnow()
        diff = now - self.created_at
        
        if diff.days == 0:
            if diff.seconds < 3600:
                time_str = f"{max(1, diff.seconds // 60)} minutes ago"
            else:
                time_str = f"{diff.seconds // 3600} hours ago"
        elif diff.days == 1:
            time_str = "Yesterday"
        else:
            time_str = self.created_at.strftime('%d %b %Y, %I:%M %p')

        return {
            "id": self.id,
            "user": self.user.username if self.user else "System",
            "action": self.action,
            "description": self.description,
            "type": self.log_type,
            "time": time_str,
            "raw_date": self.created_at.isoformat()
        }