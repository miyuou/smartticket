# SmartTicket Analyst – Backend Flask

## Stack technique
- Python 3.10+
- Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Migrate, Flask-CORS
- Marshmallow, pandas, bcrypt
- MySQL

## Installation
1. Cloner le repo et se placer dans `backend/`
2. Installer les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
3. Configurer la base MySQL dans `.env` :
   ```env
   DATABASE_URI=mysql://user:password@localhost:3306/smartticket
   SECRET_KEY=dev_secret
   JWT_SECRET_KEY=jwt_secret
   CORS_ORIGINS=*
   ```
4. Initialiser la base :
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   python seed.py
   ```
5. Lancer le serveur :
   ```bash
   python run.py
   ```

## Structure du projet
```
backend/
  models/         # Modèles SQLAlchemy
  routes/         # Blueprints Flask (auth, tickets, users, stats, import_export)
  schemas/        # Schémas Marshmallow
  utils/          # Décorateurs, hash utils
  config.py       # Configuration Flask
  extensions.py   # Extensions Flask
  app.py          # Factory Flask
  run.py          # Entrée serveur
  requirements.txt
  seed.py         # Données de test
```

## Endpoints principaux
- POST   `/auth/login`         : Connexion, retourne JWT
- GET    `/tickets`            : Liste des tickets (selon rôle)
- GET    `/tickets/<id>`       : Détail ticket
- POST   `/tickets`            : Création (admin)
- PUT    `/tickets/<id>`       : Modification (admin/technicien)
- DELETE `/tickets/<id>`       : Suppression (admin)
- GET    `/users`              : Liste utilisateurs (admin)
- POST   `/users`              : Création utilisateur (admin)
- PUT    `/users/<id>`         : Modification utilisateur (admin)
- DELETE `/users/<id>`         : Suppression utilisateur (admin)
- GET    `/stats`              : Statistiques (selon rôle)
- POST   `/import`             : Import CSV (admin)
- GET    `/export`             : Export CSV (filtré par rôle)

## Authentification & Sécurité
- JWT dans header `Authorization: Bearer <token>`
- Middleware `@role_required([...])` sur chaque route protégée
- Pas d'inscription publique

## Tests
- Testable avec Postman (importer le token JWT après login)
- Données de test via `seed.py`

## Déploiement
- Prêt pour déploiement sur serveur compatible Flask/MySQL

## Contact
Pour toute question, contactez l'équipe IT. 