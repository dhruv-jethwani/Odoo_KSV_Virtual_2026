import os
import datetime
import jwt
from flask import request, jsonify
from models import db
from models.user import User
from . import auth_bp

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Extract exact keys sent by frontend
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    username = data.get('username') 
    email = data.get('email')
    password = data.get('password')
    country = data.get('country')
    phone = data.get('phone') 
    role = data.get('role')

    if not all([first_name, last_name, username, email, password, country, role]):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    # Create new user
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        country=country,
        phoneno=phone,
        role=role
    )
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Registration successful!", 
        "user": new_user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({"error": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    token_expiration = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    token = jwt.encode({
        'user_id': user.id,
        'exp': token_expiration
    }, os.getenv('JWT_SECRET', 'fallback_secret'), algorithm='HS256')

    return jsonify({
        "message": f"Welcome back, {user.username}!",
        "user": user.to_dict(),
        "token": token
    }), 200

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Authorization token missing or invalid"}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, os.getenv('JWT_SECRET', 'fallback_secret'), algorithms=['HS256'])
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify(user.to_dict()), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401