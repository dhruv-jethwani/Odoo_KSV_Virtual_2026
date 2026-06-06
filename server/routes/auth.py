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

    full_name = data.get('fullName')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([full_name, username, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    new_user = User(full_name=full_name, username=username, email=email)
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

    # Generate the JWT Token
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