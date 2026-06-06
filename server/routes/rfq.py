from flask import request, jsonify
from models import db
from models.rfq import Rfq
from models.user import User
from . import rfq_bp

@rfq_bp.route('/add', methods=['POST'])
def add_rfq():
    data = request.get_json()
    
    # In a real app, extract user_id from JWT token. 
    # For now, we safely fallback to the first admin/manager in the DB to satisfy the FK constraint.
    user = User.query.first() 
    user_id = user.id if user else 1

    new_rfq = Rfq(
        title=data.get('title'),
        category=data.get('category'),
        deadline=data.get('deadline'),
        description=data.get('description'),
        item_name=data.get('itemName'),
        quantity=data.get('quantity'),
        status='Open', # Defaulting to Open as requested
        created_by=user_id
    )
    
    try:
        db.session.add(new_rfq)
        db.session.commit()
        return jsonify({
            "message": "RFQ created successfully",
            "rfq": new_rfq.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@rfq_bp.route('/', methods=['GET'], strict_slashes=False)
def get_rfqs():
    # Fetch all RFQs ordered by newest first
    rfqs = Rfq.query.order_by(Rfq.created_at.desc()).all()
    return jsonify([rfq.to_dict() for rfq in rfqs]), 200