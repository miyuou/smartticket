from flask import Blueprint, request, jsonify, send_file
from models.ticket import Ticket
from models.user import User
from extensions import db
from utils.decorators import role_required
from flask_jwt_extended import get_jwt
import pandas as pd
import io
from datetime import datetime

import_export_bp = Blueprint('import_export', __name__)

@import_export_bp.route('/import', methods=['POST'])
@role_required(['admin'])
def import_csv():
    if 'file' not in request.files:
        return jsonify({'msg': 'Aucun fichier fourni'}), 400
    file = request.files['file']
    df = pd.read_csv(file)
    for _, row in df.iterrows():
        ticket = Ticket(
            titre=row['titre'],
            description=row.get('description'),
            date_d_ouverture=pd.to_datetime(row['date_d_ouverture']),
            demandeur=row['demandeur'],
            categorie_id=row['categorie_id'],
            statut_id=row['statut_id'],
            type_id=row['type_id'],
            departement_demandeur=row.get('departement_demandeur'),
            date_resolution=pd.to_datetime(row['date_resolution']) if pd.notnull(row.get('date_resolution')) else None,
            date_modification=datetime.utcnow()
        )
        db.session.add(ticket)
    db.session.commit()
    return jsonify({'msg': 'Import terminé'})

@import_export_bp.route('/export', methods=['GET'])
@role_required(['admin', 'user', 'technicien'])
def export_csv():
    claims = get_jwt()
    user_id = claims.get('user_id')
    role = claims.get('role')
    query = Ticket.query
    if role == 'technicien':
        query = query.join(Ticket.techniciens).filter(User.id == user_id)
    tickets = query.all()
    data = []
    for t in tickets:
        data.append({
            'id': t.id,
            'titre': t.titre,
            'description': t.description,
            'date_d_ouverture': t.date_d_ouverture,
            'demandeur': t.demandeur,
            'categorie_id': t.categorie_id,
            'statut_id': t.statut_id,
            'type_id': t.type_id,
            'departement_demandeur': t.departement_demandeur,
            'date_resolution': t.date_resolution,
            'date_modification': t.date_modification
        })
    df = pd.DataFrame(data)
    output = io.StringIO()
    df.to_csv(output, index=False)
    output.seek(0)
    return send_file(io.BytesIO(output.getvalue().encode()), mimetype='text/csv', as_attachment=True, download_name='tickets.csv') 