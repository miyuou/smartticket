from flask import Blueprint, request, jsonify, abort
from models.user import User
from extensions import db
from schemas.user_schema import user_schema, users_schema
from utils.decorators import role_required
from utils.auth import hash_password

users_bp = Blueprint('users', __name__, url_prefix='/users')

@users_bp.route('', methods=['GET'])
@role_required(['admin'])
def get_users():
    users = User.query.all()
    return jsonify(users_schema.dump(users))

@users_bp.route('', methods=['POST'])
@role_required(['admin'])
def create_user():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'msg': 'Email déjà utilisé'}), 400
    
    if 'mot_de_passe' not in data or not data['mot_de_passe']:
        return jsonify({'msg': 'Le mot de passe est requis'}), 400
   
    user = User(
        nom=data['nom'],
        email=data['email'],
        mot_de_passe=hash_password(data['mot_de_passe']),
        role=data['role']
    )
    db.session.add(user)
    db.session.commit()
    return user_schema.dump(user), 201

@users_bp.route('/<int:user_id>', methods=['PUT'])
@role_required(['admin'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.nom = data.get('nom', user.nom)
    user.email = data.get('email', user.email)
    if 'mot_de_passe' in data:
        user.mot_de_passe = hash_password(data['mot_de_passe'])
    user.role = data.get('role', user.role)
    db.session.commit()
    return user_schema.dump(user)

@users_bp.route('/<int:user_id>', methods=['DELETE'])
@role_required(['admin'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204 