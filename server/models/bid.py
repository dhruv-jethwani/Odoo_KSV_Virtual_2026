from . import db
import datetime

class Bid(db.Model):
    __tablename__ = 'bids'
    
    id = db.Column(db.Integer, primary_key=True)
    rfq_id = db.Column(db.Integer, db.ForeignKey('rfqs.id'), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) 
    quoted_price = db.Column(db.Float, nullable=False)
    delivery_time = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='Pending') # Pending, Accepted, Rejected
    terms = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Relationships
    rfq = db.relationship('Rfq', backref='bids')
    vendor = db.relationship('User', backref='bids')

    def to_dict(self):
        return {
            "id": f"QT-{5000 + self.id}",
            "raw_id": self.id,
            "rfq_id": f"RFQ-{1000 + self.rfq_id}",
            "vendor": self.vendor.username if self.vendor else "Unknown",
            "amount": self.quoted_price,
            "delivery": self.delivery_time,
            "status": self.status,
            "terms": self.terms,
            "date": self.created_at.strftime('%d %b %Y') if self.created_at else None
        }