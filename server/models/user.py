from . import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    country = db.Column(db.String(255), nullable=False)
    phoneno = db.Column(db.String(20))
    role = db.Column(db.String(30), nullable=False)
    approval_status = db.Column(db.String(50), default='Approved') # Fix: Added missing column
    
    # Establish relationship to Vendor profile
    vendor_profile = db.relationship('Vendor', backref='user_account', uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "approvalStatus": self.approval_status
        }

class Vendor(db.Model):
    __tablename__ = 'vendors'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) # Links to login
    company_name = db.Column(db.String(150), nullable=False)
    contact_person = db.Column(db.String(100), nullable=False)
    tax_id = db.Column(db.String(50), unique=True, nullable=False)
    compliance_status = db.Column(db.String(50), default='Pending Review')
    
    def to_dict(self):
        return {
            "id": self.id,
            "companyName": self.company_name,
            "contactPerson": self.contact_person,
            "taxId": self.tax_id,
            "complianceStatus": self.compliance_status,
            # Fix: Safeguards in case the joined user is missing/null to prevent 500 errors
            "email": self.user_account.email if self.user_account else "", 
            "phone": self.user_account.phoneno if self.user_account else ""
        }