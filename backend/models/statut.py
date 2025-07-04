from extensions import db

class Statut(db.Model):
    __tablename__ = 'statuts'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50), nullable=False, unique=True)

    def __repr__(self):
        return f'<Statut {self.nom}>' 