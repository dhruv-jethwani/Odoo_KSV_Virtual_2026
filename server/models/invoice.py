from . import db
import datetime

class Invoice(db.Model):
    __tablename__ = 'invoices'
    
    id = db.Column(db.Integer, primary_key=True)
    po_id = db.Column(db.Integer, db.ForeignKey('purchase_orders.id'), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default='Pending Payment') # Pending Payment, Paid
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Relationships
    po = db.relationship('PurchaseOrder', backref='invoice', uselist=False)
    vendor = db.relationship('User', backref='invoices')

    def to_dict(self):
        items = []
        if self.po and self.po.rfq:
            qty = self.po.rfq.quantity or 1
            items.append({
                "desc": self.po.rfq.item_name or self.po.rfq.title,
                "qty": qty,
                "rate": self.amount / qty,
                "tax": 0,
                "amount": self.amount
            })

        return {
            "id": f"INV-{8000 + self.id}",
            "raw_id": self.id,
            "poRef": f"PO-{2000 + self.po_id}",
            "vendor": self.vendor.username if self.vendor else "Unknown",
            "date": self.created_at.strftime('%d %b %Y') if self.created_at else None,
            "dueDate": self.due_date.strftime('%d %b %Y') if self.due_date else None,
            "amount": f"${self.amount:,.2f}",
            "status": self.status,
            "items": items
        }