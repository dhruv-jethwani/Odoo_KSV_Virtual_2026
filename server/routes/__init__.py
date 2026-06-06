from flask import Blueprint

auth_bp = Blueprint('auth', __name__)
vendor_bp = Blueprint('vendors', __name__)
rfq_bp = Blueprint('rfqs', __name__)
bid_bp = Blueprint('bids', __name__)
approval_bp = Blueprint('approvals', __name__)
po_bp = Blueprint('pos', __name__)
invoice_bp = Blueprint('invoices', __name__)
report_bp = Blueprint('reports', __name__)
activity_bp = Blueprint('activities', __name__)