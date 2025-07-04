from extensions import db

class Categorie(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50), nullable=False, unique=True)

    def __repr__(self):
        return f'<Categorie {self.nom}>' 