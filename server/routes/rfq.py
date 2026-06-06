from flask import Blueprint, request, jsonify
from models import db
from models.rfq import Rfq
from models.user import User, Vendor
from utils.email_service import send_email
from . import rfq_bp

@rfq_bp.route('/add', methods=['POST'])
def add_rfq():
    data = request.get_json()
    
    user = User.query.first() 
    user_id = user.id if user else 1

    invited_vendors = data.get('invitedVendors', [])

    new_rfq = Rfq(
        title=data.get('title'),
        category=data.get('category'),
        deadline=data.get('deadline'),
        description=data.get('description'),
        item_name=data.get('itemName'),
        quantity=data.get('quantity'),
        status='Open',
        created_by=user_id,
        vendors_invited=len(invited_vendors)
    )
    
    try:
        db.session.add(new_rfq)
        db.session.commit()

        # Send email invitations to selected vendors
        for v_id in invited_vendors:
            vendor_profile = Vendor.query.get(v_id)
            if vendor_profile and vendor_profile.user_account:
                vendor_email = vendor_profile.user_account.email
                vendor_name = vendor_profile.contact_person
                subject = f"New RFQ Invitation: {new_rfq.title}"
                body = f"""
                <h3>Hello {vendor_name},</h3>
                <p>You have been invited to submit a quotation for a new RFQ by VendorBridge.</p>
                <ul>
                    <li><strong>RFQ Title:</strong> {new_rfq.title}</li>
                    <li><strong>Item:</strong> {new_rfq.item_name} (Qty: {new_rfq.quantity})</li>
                    <li><strong>Deadline:</strong> {new_rfq.deadline}</li>
                </ul>
                <p>Please log in to your dashboard to submit your competitive bid.</p>
                """
                send_email(vendor_email, subject, body)

        return jsonify({
            "message": "RFQ created and invitations sent successfully",
            "rfq": new_rfq.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@rfq_bp.route('/', methods=['GET'], strict_slashes=False)
def get_rfqs():
    rfqs = Rfq.query.order_by(Rfq.created_at.desc()).all()
    return jsonify([rfq.to_dict() for rfq in rfqs]), 200