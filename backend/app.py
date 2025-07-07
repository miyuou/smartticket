from flask import Flask
from config import Config
from extensions import db, jwt, migrate, ma, cors

# Blueprints seront importés plus tard

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialisation des extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    cors.init_app(app, origins=app.config['CORS_ORIGINS'])

    # Import et enregistrement des blueprints (routes)
    from routes.auth import auth_bp
    from routes.tickets import tickets_bp
    from routes.users import users_bp
    from routes.stats import stats_bp
    from routes.import_export import import_export_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(tickets_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(stats_bp)
    app.register_blueprint(import_export_bp, url_prefix='/import_export')
    return app 