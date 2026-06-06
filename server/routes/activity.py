from flask import Blueprint, request, jsonify
from models import db
from models.activity import ActivityLog
from models.user import User
from . import activity_bp

@activity_bp.route('/', methods=['GET'], strict_slashes=False)
def get_activities():
    # Fetch top 50 recent activities
    logs = ActivityLog.query.order_by(ActivityLog.created_at.desc()).limit(50).all()
    return jsonify([log.to_dict() for log in logs]), 200

# Helper route specifically for testing or frontend manual logging
@activity_bp.route('/log', methods=['POST'])
def add_log():
    data = request.get_json()
    
    # Safe fallback for user
    user = User.query.first()
    user_id = user.id if user else None

    new_log = ActivityLog(
        user_id=user_id,
        action=data.get('action', 'System Event'),
        description=data.get('description', 'An action occurred.'),
        log_type=data.get('type', 'Audit')
    )
    
    try:
        db.session.add(new_log)
        db.session.commit()
        return jsonify({"message": "Activity logged"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Let's auto-generate some mock data if the table is empty so your UI looks good immediately
@activity_bp.route('/seed', methods=['POST'])
def seed_logs():
    if ActivityLog.query.count() > 0:
        return jsonify({"message": "Logs already exist"}), 200
        
    user = User.query.first()
    user_id = user.id if user else None
    
    sample_logs = [
        ActivityLog(user_id=user_id, action="System Boot", description="VendorBridge ERP system initialized.", log_type="System"),
        ActivityLog(user_id=user_id, action="RFQ Created", description="RFQ-1042 was published for Office Supplies.", log_type="Audit"),
        ActivityLog(user_id=user_id, action="Quotation Received", description="TechCorp submitted a bid of $4,500 for RFQ-1042.", log_type="Alert"),
        ActivityLog(user_id=user_id, action="Purchase Order Auto-Generated", description="PO-2001 created following Manager approval.", log_type="Status")
    ]
    
    db.session.add_all(sample_logs)
    db.session.commit()
    return jsonify({"message": "Sample logs generated"}), 201