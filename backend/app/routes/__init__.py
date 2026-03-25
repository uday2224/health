from app.routes.auth import auth_bp
from app.routes.user import user_bp


def register_blueprints(app):
    """Register all route blueprints."""
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
