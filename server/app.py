import os
from flask import Flask
from flask_cors import CORS
from models import db
from routes.auth import auth_bp
from routes.vendor import vendor_bp
from routes.bid import bid_bp
from routes.rfq import rfq_bp # Import new routes
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app) 

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(vendor_bp, url_prefix='/api/vendor')
app.register_blueprint(rfq_bp, url_prefix='/api/rfq')
app.register_blueprint(bid_bp, url_prefix='/api/bid')

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)