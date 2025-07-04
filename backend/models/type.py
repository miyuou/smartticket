from extensions import db

class Type(db.Model):
    __tablename__ = 'types'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50), nullable=False, unique=True)

    def __repr__(self):
        return f'<Type {self.nom}>' 