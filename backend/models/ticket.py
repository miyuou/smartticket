from extensions import db

# Association table for many-to-many Ticket-Technicien
technicien_ticket = db.Table(
    'technicien_ticket',
    db.Column('ticket_id', db.Integer, db.ForeignKey('tickets.id'), primary_key=True),
    db.Column('technicien_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class Ticket(db.Model):
    __tablename__ = 'tickets'
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date_d_ouverture = db.Column(db.DateTime, nullable=False)
    demandeur = db.Column(db.String(100), nullable=False)
    categorie_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    statut_id = db.Column(db.Integer, db.ForeignKey('statuts.id'), nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey('types.id'), nullable=False)
    departement_demandeur = db.Column(db.String(100), nullable=True)
    date_resolution = db.Column(db.DateTime, nullable=True)
    date_modification = db.Column(db.DateTime, nullable=True)

    # Relations
    techniciens = db.relationship('User', secondary=technicien_ticket, backref='tickets')
    categorie = db.relationship('Categorie')
    statut = db.relationship('Statut')
    type = db.relationship('Type')

    def __repr__(self):
        return f'<Ticket {self.titre}>' 