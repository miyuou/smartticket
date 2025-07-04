from extensions import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mot_de_passe = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin, user, technicien
    
    def __repr__(self):
        return f'<User {self.email}>' 