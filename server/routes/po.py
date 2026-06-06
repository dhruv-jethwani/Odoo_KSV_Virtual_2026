from flask import request, jsonify
from models import db
from models.po import PurchaseOrder
from models.invoice import Invoice
import datetime
from . import po_bp

@po_bp.route('/', methods=['GET'], strict_slashes=False)
def get_pos():
    pos = PurchaseOrder.query.order_by(PurchaseOrder.created_at.desc()).all()
    return jsonify([po.to_dict() for po in pos]), 200

@po_bp.route('/<int:po_id>/invoice', methods=['POST'])
def generate_invoice(po_id):
    po = PurchaseOrder.query.get(po_id)
    if not po:
        return jsonify({"error": "Purchase Order not found"}), 404
        
    if po.status == 'Invoiced':
        return jsonify({"error": "Invoice already generated for this PO"}), 400
        
    # Update PO Status
    po.status = 'Invoiced'
    
    # Calculate due date (Net 30 days)
    due_date = datetime.datetime.utcnow() + datetime.timedelta(days=30)
    
    # Create Invoice
    new_invoice = Invoice(
        po_id=po.id,
        vendor_id=po.vendor_id,
        amount=po.amount,
        due_date=due_date,
        status='Pending Payment'
    )
    db.session.add(new_invoice)
    
    try:
        db.session.commit()
        return jsonify({
            "message": f"Invoice generated successfully for PO-{2000 + po.id}",
            "invoice": new_invoice.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500