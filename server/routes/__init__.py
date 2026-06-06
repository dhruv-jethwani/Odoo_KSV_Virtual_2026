from flask import Blueprint

auth_bp = Blueprint('auth', __name__)
vendor_bp = Blueprint('vendors', __name__)
rfq_bp = Blueprint('rfqs', __name__)
bid_bp = Blueprint('bids', __name__)