from flask import Blueprint, request, jsonify
from models import db
from models.bid import Bid
from models.po import PurchaseOrder
from models.rfq import Rfq
from . import approval_bp

@approval_bp.route('/', methods=['GET'], strict_slashes=False)
def get_pending_approvals():
    # Fetch bids that are pending approval
    pending_bids = Bid.query.filter_by(status='Pending').order_by(Bid.created_at.desc()).all()
    
    result = []
    for bid in pending_bids:
        result.append({
            "id": f"APV-{900 + bid.id}", 
            "bid_id": bid.id,
            "rfq": f"RFQ-{1000 + bid.rfq_id}",
            "title": bid.rfq.title if bid.rfq else "Unknown RFQ",
            "vendor": bid.vendor.username if bid.vendor else "Unknown Vendor",
            "amount": f"${bid.quoted_price:,.2f}",
            "raw_amount": bid.quoted_price,
            "date": bid.created_at.strftime('%d %b %Y') if bid.created_at else "Unknown",
            "status": bid.status
        })
    return jsonify(result), 200

@approval_bp.route('/<int:bid_id>/action', methods=['POST'])
def process_approval(bid_id):
    data = request.get_json()
    action = data.get('action') # 'Approved' or 'Rejected'
    remarks = data.get('remarks', '')

    bid = Bid.query.get(bid_id)
    if not bid:
        return jsonify({"error": "Quotation/Bid not found"}), 404

    if action == 'Approved':
        bid.status = 'Approved'
        
        # Mark the original RFQ as Awarded
        if bid.rfq:
            bid.rfq.status = 'Awarded'

        # Generate the Official Purchase Order
        new_po = PurchaseOrder(
            rfq_id=bid.rfq_id,
            vendor_id=bid.vendor_id,
            bid_id=bid.id,
            amount=bid.quoted_price,
            remarks=remarks,
            status='Issued'
        )
        db.session.add(new_po)

        # Reject all other competing bids for this RFQ automatically
        other_bids = Bid.query.filter(Bid.rfq_id == bid.rfq_id, Bid.id != bid.id).all()
        for ob in other_bids:
            ob.status = 'Rejected'

    elif action == 'Rejected':
        bid.status = 'Rejected'
    else:
        return jsonify({"error": "Invalid action parameter"}), 400

    try:
        db.session.commit()
        msg = "Purchase Order generated successfully!" if action == 'Approved' else "Quotation rejected."
        return jsonify({"message": msg}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500