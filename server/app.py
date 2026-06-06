import os
from flask import Flask
from flask_cors import CORS
from models import db
from routes.auth import auth_bp
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app) 

# Database Configuration for TiDB Cloud
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# Create tables automatically on startup
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)