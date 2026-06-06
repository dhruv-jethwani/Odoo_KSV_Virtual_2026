from flask import request, jsonify
from models import db
from models.user import User, Vendor
import string
import random
from . import vendor_bp

# A simple password generator for the newly added vendors
def generate_temp_password(length=8):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

@vendor_bp.route('/add', methods=['POST'])
def add_vendor():
    # In production, you would protect this with the @role_required decorator
    # to ensure only Officers/Admins can hit this route.
    data = request.get_json()
    
    # 1. Create the User Login Account for the Vendor
    temp_password = generate_temp_password()
    username = data.get('companyName').replace(" ", "").lower() + str(random.randint(10, 99))
    
    new_user = User(
        first_name=data.get('contactFirstName'),
        last_name=data.get('contactLastName'),
        username=username,
        email=data.get('email'),
        country=data.get('country'),
        phoneno=data.get('phone'),
        role='Vendor',
        approval_status='Approved' # Ensure added vendors are auto-approved
    )
    new_user.set_password(temp_password)
    db.session.add(new_user)
    db.session.flush() # Gets the new_user.id without committing to DB yet

    # 2. Create the Vendor Profile connected to the User ID
    new_vendor = Vendor(
        user_id=new_user.id,
        company_name=data.get('companyName'),
        contact_person=f"{data.get('contactFirstName')} {data.get('contactLastName')}",
        tax_id=data.get('taxId'),
        compliance_status='Active'
    )
    db.session.add(new_vendor)
    db.session.commit()

    # Note: In a real app, you would email the 'username' and 'temp_password' to the vendor here.
    return jsonify({
        "message": "Vendor added successfully",
        "vendor": new_vendor.to_dict(),
        "generated_credentials": {"username": username, "password": temp_password} 
    }), 201

# Fix: Added strict_slashes=False so Axios calls to /api/vendor or /api/vendor/ both work
@vendor_bp.route('/', methods=['GET'], strict_slashes=False)
def get_vendors():
    # Fetch all vendors from the database
    all_vendors = Vendor.query.all()
    # Use the to_dict() method we defined in the model
    return jsonify([vendor.to_dict() for vendor in all_vendors]), 200