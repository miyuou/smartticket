from app import create_app
from extensions import db
from models.user import User
from models.statut import Statut
from models.categorie import Categorie
from models.type import Type
from models.ticket import Ticket
from utils.auth import hash_password
from datetime import datetime

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Statuts
    statuts = [Statut(nom=n) for n in ['Nouveau', 'En attente', 'En cours', 'Résolu']]
    db.session.add_all(statuts)
    # Catégories
    categories = [Categorie(nom=n) for n in ['Réseau', 'Logiciel', 'Matériel']]
    db.session.add_all(categories)
    # Types
    types = [Type(nom=n) for n in ['Demande', 'Incident']]
    db.session.add_all(types)
    db.session.commit()

    # Utilisateurs
    admin = User(nom='Admin', email='admin@test.com', mot_de_passe=hash_password('admin123'), role='admin')
    tech = User(nom='Tech', email='tech@test.com', mot_de_passe=hash_password('tech123'), role='technicien')
    user = User(nom='Manager', email='user@test.com', mot_de_passe=hash_password('user123'), role='user')
    db.session.add_all([admin, tech, user])
    db.session.commit()

    # Tickets
    t1 = Ticket(
        titre='Problème réseau',
        description='Impossible de se connecter à Internet',
        date_d_ouverture=datetime.utcnow(),
        demandeur='Manager',
        categorie_id=categories[0].id,
        statut_id=statuts[0].id,
        type_id=types[1].id,
        departement_demandeur='IT',
        date_modification=datetime.utcnow()
    )
    t1.techniciens.append(tech)
    db.session.add(t1)
    db.session.commit()
    print('Base de test initialisée.') 