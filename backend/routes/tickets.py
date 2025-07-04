from flask import Blueprint, request, jsonify, abort
from models.ticket import Ticket
from models.user import User
from models.categorie import Categorie
from models.statut import Statut
from models.type import Type
from extensions import db
from schemas.ticket_schema import ticket_schema, tickets_schema
from utils.decorators import role_required
from flask_jwt_extended import get_jwt_identity, get_jwt
from datetime import datetime

tickets_bp = Blueprint('tickets', __name__, url_prefix='/tickets')

# GET /tickets : selon le rôle
@tickets_bp.route('', methods=['GET'])
@role_required(['admin', 'technicien', 'user'])
def get_tickets():
    claims = get_jwt()
    user_id = claims.get('user_id')
    role = claims.get('role')
    if role == 'admin' or role == 'user':
        tickets = Ticket.query.all()
    elif role == 'technicien':
        tickets = Ticket.query.join(Ticket.techniciens).filter(User.id == user_id).all()
    else:
        return abort(403)
    return jsonify(tickets_schema.dump(tickets))

# GET /tickets/<id>
@tickets_bp.route('/<int:ticket_id>', methods=['GET'])
@role_required(['admin', 'technicien', 'user'])
def get_ticket(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    return ticket_schema.dump(ticket)

# POST /tickets
@tickets_bp.route('', methods=['POST'])
@role_required(['admin'])
def create_ticket():
    data = request.get_json()
    ticket = Ticket(
        titre=data['titre'],
        description=data.get('description'),
        date_d_ouverture=datetime.utcnow(),
        demandeur=data['demandeur'],
        categorie_id=data['categorie_id'],
        statut_id=data['statut_id'],
        type_id=data['type_id'],
        departement_demandeur=data.get('departement_demandeur'),
        date_modification=datetime.utcnow()
    )
    # Ajout des techniciens
    if 'technicien_ids' in data:
        ticket.techniciens = User.query.filter(User.id.in_(data['technicien_ids'])).all()
    db.session.add(ticket)
    db.session.commit()
    return ticket_schema.dump(ticket), 201

# PUT /tickets/<id>
@tickets_bp.route('/<int:ticket_id>', methods=['PUT'])
@role_required(['admin', 'technicien'])
def update_ticket(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    data = request.get_json()
    claims = get_jwt()
    role = claims.get('role')
    user_id = claims.get('user_id')
    # Technicien ne peut modifier que le statut de ses tickets
    if role == 'technicien' and user_id not in [t.id for t in ticket.techniciens]:
        return abort(403)
    if 'titre' in data:
        ticket.titre = data['titre']
    if 'description' in data:
        ticket.description = data['description']
    if 'statut_id' in data:
        ticket.statut_id = data['statut_id']
    if 'categorie_id' in data:
        ticket.categorie_id = data['categorie_id']
    if 'type_id' in data:
        ticket.type_id = data['type_id']
    if 'departement_demandeur' in data:
        ticket.departement_demandeur = data['departement_demandeur']
    if 'date_resolution' in data:
        ticket.date_resolution = data['date_resolution']
    if 'technicien_ids' in data and role == 'admin':
        ticket.techniciens = User.query.filter(User.id.in_(data['technicien_ids'])).all()
    ticket.date_modification = datetime.utcnow()
    db.session.commit()
    return ticket_schema.dump(ticket)

# DELETE /tickets/<id>
@tickets_bp.route('/<int:ticket_id>', methods=['DELETE'])
@role_required(['admin'])
def delete_ticket(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    db.session.delete(ticket)
    db.session.commit()
    return '', 204 