from app import create_app
from extensions import db
from models.user import User
from utils.auth import hash_password

app = create_app()
with app.app_context():
    db.create_all()  # au cas où
    if not User.query.filter_by(email="meryem@test.com").first():
        user = User(
            nom="meryem",
            email="meryem@test.com",
            mot_de_passe=hash_password("123456"),
            role="admin"
        )
        db.session.add(user)
        db.session.commit()
        print("✅ Utilisateur meryem@test.com créé avec succès")
    else:
        print("ℹ️ Utilisateur déjà existant")
