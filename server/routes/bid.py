from flask import request, jsonify
from models import db
from models.bid import Bid
from models.user import User
from models.rfq import Rfq
from . import bid_bp

@bid_bp.route('/add', methods=['POST'])
def add_bid():
    data = request.get_json()
    
    # In production, use token payload.
    vendor = User.query.filter_by(role='Vendor').first()
    vendor_id = vendor.id if vendor else 1
    
    # Safely parse the RFQ ID
    raw_rfq_id = data.get('rfq_id')
    try:
        if isinstance(raw_rfq_id, str) and raw_rfq_id.startswith('RFQ-'):
            raw_rfq_id = int(raw_rfq_id.replace('RFQ-', '')) - 1000
        else:
            raw_rfq_id = int(raw_rfq_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid RFQ Reference format."}), 400

    # FIX: Verify that the RFQ actually exists to prevent Foreign Key crashes
    rfq_exists = Rfq.query.get(raw_rfq_id)
    if not rfq_exists:
        return jsonify({"error": f"Target RFQ ({data.get('rfq_id')}) does not exist."}), 404

    new_bid = Bid(
        rfq_id=raw_rfq_id,
        vendor_id=vendor_id,
        quoted_price=float(data.get('amount', 0)),
        delivery_time=data.get('delivery', 'Standard'),
        terms=data.get('terms', ''),
        status='Pending'
    )
    
    try:
        db.session.add(new_bid)
        db.session.commit()
        return jsonify({
            "message": "Quotation submitted successfully",
            "bid": new_bid.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bid_bp.route('/', methods=['GET'], strict_slashes=False)
def get_bids():
    bids = Bid.query.order_by(Bid.created_at.desc()).all()
    return jsonify([bid.to_dict() for bid in bids]), 200

# Endpoint to update bid status (Approve/Reject)
@bid_bp.route('/<int:bid_id>/status', methods=['PATCH'])
def update_bid_status(bid_id):
    data = request.get_json()
    new_status = data.get('status')
    
    bid = Bid.query.get(bid_id)
    if not bid:
        return jsonify({"error": "Bid not found"}), 404
        
    bid.status = new_status
    db.session.commit()
    return jsonify({"message": f"Bid status updated to {new_status}"}), 200