from . import db
import datetime

class PurchaseOrder(db.Model):
    __tablename__ = 'purchase_orders'
    
    id = db.Column(db.Integer, primary_key=True)
    rfq_id = db.Column(db.Integer, db.ForeignKey('rfqs.id'), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bid_id = db.Column(db.Integer, db.ForeignKey('bids.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='Issued') # Issued, Invoiced
    remarks = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Relationships
    rfq = db.relationship('Rfq', backref='purchase_orders')
    vendor = db.relationship('User', backref='purchase_orders')
    bid = db.relationship('Bid', backref='purchase_order', uselist=False)

    def to_dict(self):
        # Format the items for the frontend document table
        items = []
        if self.rfq:
            qty = self.rfq.quantity or 1
            items.append({
                "desc": self.rfq.item_name or self.rfq.title,
                "qty": qty,
                "rate": self.amount / qty,
                "tax": 0, # Assuming tax inclusive for demo simplicity
                "amount": self.amount
            })

        return {
            "id": f"PO-{2000 + self.id}",
            "raw_id": self.id,
            "rfq": f"RFQ-{1000 + self.rfq_id}",
            "vendor": self.vendor.username if self.vendor else "Unknown",
            "amount": f"${self.amount:,.2f}",
            "raw_amount": self.amount,
            "status": self.status,
            "date": self.created_at.strftime('%d %b %Y') if self.created_at else None,
            "items": items
        }