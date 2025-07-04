from flask import Blueprint, jsonify
from models.ticket import Ticket
from models.user import User
from extensions import db
from utils.decorators import role_required
from flask_jwt_extended import get_jwt
from sqlalchemy import func
from datetime import datetime

stats_bp = Blueprint('stats', __name__, url_prefix='/stats')

@stats_bp.route('', methods=['GET'])
@role_required(['admin', 'technicien', 'user'])
def get_stats():
    claims = get_jwt()
    user_id = claims.get('user_id')
    role = claims.get('role')
    query = Ticket.query
    if role == 'technicien':
        query = query.join(Ticket.techniciens).filter(User.id == user_id)
    total = query.count()
    resolus = query.filter(Ticket.statut.has(nom='Résolu')).count()
    # Temps moyen de résolution
    delais = []
    for t in query.filter(Ticket.date_resolution.isnot(None)).all():
        if t.date_resolution and t.date_d_ouverture:
            delais.append((t.date_resolution - t.date_d_ouverture).total_seconds())
    temps_moyen = sum(delais) / len(delais) / 3600 if delais else 0
    taux_resolution = (resolus / total * 100) if total else 0
    # Répartition par statut
    repartition_statut = db.session.query(func.count(Ticket.id), Ticket.statut_id).group_by(Ticket.statut_id).all()
    # Répartition par catégorie
    repartition_categorie = db.session.query(func.count(Ticket.id), Ticket.categorie_id).group_by(Ticket.categorie_id).all()
    # Répartition par technicien
    repartition_technicien = db.session.query(func.count(Ticket.id), User.nom).join(Ticket.techniciens).group_by(User.nom).all()
    return jsonify({
        'total_tickets': total,
        'tickets_resolus': resolus,
        'temps_moyen_resolution_h': round(temps_moyen, 2),
        'taux_resolution': round(taux_resolution, 2),
        'repartition_statut': [{'statut_id': s[1], 'count': s[0]} for s in repartition_statut],
        'repartition_categorie': [{'categorie_id': c[1], 'count': c[0]} for c in repartition_categorie],
        'repartition_technicien': [{'technicien': t[1], 'count': t[0]} for t in repartition_technicien]
    }) 