from flask import request, jsonify
from models import db
from models.invoice import Invoice
from . import invoice_bp


@invoice_bp.route('/', methods=['GET'], strict_slashes=False)
def get_invoices():
    # Fetch all invoices ordered by most recent first
    invoices = Invoice.query.order_by(Invoice.created_at.desc()).all()
    return jsonify([inv.to_dict() for inv in invoices]), 200

@invoice_bp.route('/<int:invoice_id>/pay', methods=['PATCH'])
def mark_as_paid(invoice_id):
    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        return jsonify({"error": "Invoice not found"}), 404
    
    if invoice.status == 'Paid':
        return jsonify({"error": "Invoice is already marked as paid"}), 400
        
    invoice.status = 'Paid'
    db.session.commit()
    
    return jsonify({"message": f"Invoice {2000 + invoice.po_id} marked as paid successfully."}), 200