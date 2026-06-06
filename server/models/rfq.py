from . import db
import datetime

class Rfq(db.Model):
    __tablename__ = 'rfqs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    item_name = db.Column(db.String(150))
    quantity = db.Column(db.Integer)
    deadline = db.Column(db.String(50))
    status = db.Column(db.String(50), default='Open') # Open, Closed, Awarded, Draft
    vendors_invited = db.Column(db.Integer, default=0)
    
    # Foreign Key linking to the User who created it
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Relationship back to User
    creator = db.relationship('User', backref='rfqs')

    def to_dict(self):
        return {
            "id": f"RFQ-{1000 + self.id}", # Format ID for the UI (e.g., RFQ-1042)
            "raw_id": self.id,
            "title": self.title,
            "category": self.category,
            "description": self.description,
            "itemName": self.item_name,
            "quantity": self.quantity,
            "deadline": self.deadline,
            "status": self.status,
            "vendors": self.vendors_invited,
            "creator": self.creator.username if self.creator else "Unknown",
            "created_at": self.created_at.strftime('%Y-%m-%d') if self.created_at else None
        }