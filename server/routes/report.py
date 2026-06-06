from flask import Blueprint, jsonify
from models import db
from models.user import Vendor
from models.po import PurchaseOrder
from models.bid import Bid
from models.rfq import Rfq
from sqlalchemy import func
import datetime
from . import report_bp

@report_bp.route('/', methods=['GET'], strict_slashes=False)
def get_dashboard_reports():
    # 1. Top Stats
    total_spend = db.session.query(func.sum(PurchaseOrder.amount)).scalar() or 0
    
    active_vendors = Vendor.query.filter_by(compliance_status='Active').count()
    total_vendors = Vendor.query.count()
    compliance_rate = int((active_vendors / total_vendors * 100)) if total_vendors > 0 else 0
    
    rejected_quotes = Bid.query.filter_by(status='Rejected').count()

    stats = [
        { "label": 'Total Spend (YTD)', "value": f"${total_spend:,.2f}", "subtext": 'Updated live', "color": 'blue' },
        { "label": 'Active Vendors', "value": str(active_vendors), "subtext": 'Platform-wide', "color": 'green' },
        { "label": 'Compliance Rate', "value": f"{compliance_rate}%", "subtext": 'Active vs Total', "color": 'yellow' },
        { "label": 'Rejected Quotes', "value": str(rejected_quotes), "subtext": 'Historical total', "color": 'red' }
    ]

    # 2. Category Spend (Join POs to RFQs to get category)
    category_data = db.session.query(
        Rfq.category, 
        func.sum(PurchaseOrder.amount)
    ).join(PurchaseOrder, PurchaseOrder.rfq_id == Rfq.id).group_by(Rfq.category).all()

    colors = ['bg-blue', 'bg-green', 'bg-yellow', 'bg-red', 'bg-blue']
    category_spend = []
    
    for i, (cat, amt) in enumerate(category_data):
        percentage = int((amt / total_spend) * 100) if total_spend > 0 else 0
        category_spend.append({
            "category": cat or 'Uncategorized',
            "percentage": percentage,
            "amount": f"${amt:,.2f}",
            "color": colors[i % len(colors)]
        })

    if not category_spend:
        category_spend = [{ "category": 'No Purchases Yet', "percentage": 0, "amount": "$0.00", "color": 'bg-blue' }]

    # 3. Top Vendors (Join POs to Vendors)
    top_vendor_data = db.session.query(
        Vendor.company_name,
        func.sum(PurchaseOrder.amount),
        func.count(PurchaseOrder.id)
    ).select_from(PurchaseOrder)\
     .join(Vendor, PurchaseOrder.vendor_id == Vendor.user_id)\
     .group_by(Vendor.company_name)\
     .order_by(func.sum(PurchaseOrder.amount).desc()).limit(4).all()

    top_vendors = []
    for name, amt, count in top_vendor_data:
        top_vendors.append({
            "name": name,
            "spend": f"${amt:,.2f}",
            "pos": count
        })
        
    if not top_vendors:
         top_vendors = [{ "name": 'Awaiting Data', "spend": "$0.00", "pos": 0 }]

    # 4. Monthly Trend (Dynamic Calculation)
    all_pos = PurchaseOrder.query.all()
    month_totals = {}
    for po in all_pos:
        month_name = po.created_at.strftime('%b')
        month_totals[month_name] = month_totals.get(month_name, 0) + po.amount
        
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    monthly_trend = []
    max_monthly = max(month_totals.values()) if month_totals else 1 # avoid div zero
    
    for m in months:
        val = month_totals.get(m, 0)
        # Give a minimum 5% height for visual appeal if 0
        height_pct = max(5, int((val / max_monthly) * 100)) if val > 0 else 5 
        monthly_trend.append({
            "month": m,
            "height": f"{height_pct}%",
            "raw": val
        })

    return jsonify({
        "stats": stats,
        "categorySpend": category_spend,
        "topVendors": top_vendors,
        "monthlyTrend": monthly_trend
    }), 200