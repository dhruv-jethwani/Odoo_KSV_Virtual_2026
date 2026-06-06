from flask import Blueprint, request, jsonify
from models import db
from models.invoice import Invoice
from utils.email_service import send_email
from . import invoice_bp

@invoice_bp.route('/', methods=['GET'], strict_slashes=False)
def get_invoices():
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

@invoice_bp.route('/<int:invoice_id>/email', methods=['POST'])
def send_invoice_email(invoice_id):
    invoice = Invoice.query.get(invoice_id)
    if not invoice:
        return jsonify({"error": "Invoice not found"}), 404

    vendor_user = invoice.vendor
    if not vendor_user or not vendor_user.email:
        return jsonify({"error": "Vendor email not found"}), 404

    subject = f"Invoice {2000 + invoice.po_id} Processed"
    body = f"""
    <h3>Hello {vendor_user.first_name},</h3>
    <p>A new invoice has been generated for your recent Purchase Order.</p>
    <ul>
        <li><strong>Amount Due:</strong> ${invoice.amount:,.2f}</li>
        <li><strong>Due Date:</strong> {invoice.due_date.strftime('%Y-%m-%d')}</li>
    </ul>
    <p>Thank you for your business!</p>
    """
    
    success = send_email(vendor_user.email, subject, body)

    if success:
        return jsonify({"message": "Invoice email sent successfully to vendor!"}), 200
    else:
        return jsonify({"error": "Failed to send email. Ensure SMTP is configured correctly."}), 500