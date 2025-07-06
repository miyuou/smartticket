from flask import Blueprint, request, jsonify
from models.user import User
from extensions import db
from utils.auth import check_password
from flask_jwt_extended import create_access_token
from schemas.user_schema import user_schema

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not check_password(password, user.mot_de_passe):
        return jsonify({'msg': 'Identifiants invalides'}), 401
    access_token = create_access_token(identity=str(user.id), additional_claims={
        'role': user.role,
        'user_id': user.id
    })
    return jsonify({
        'access_token': access_token,
        'user': user_schema.dump(user)
    }) 