from flask import Flask
from flask_cors import CORS
from app.extensions import db, jwt, socketio, migrate, init_celery
from app.config import config_by_name
from app.middleware.error_handler import register_error_handlers
from app.routes import register_blueprints
from app.sockets import register_socket_handlers

def create_app(env='development'):
    """Flask application factory"""
    app = Flask(__name__)
    app.config.from_object(config_by_name[env])
    
    # CORS
    CORS(app, 
         origins=app.config['ALLOWED_ORIGINS'],
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'])
    
    # Extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    async_mode = 'threading' if app.config.get('TESTING') else 'eventlet'
    socketio.init_app(app,
        cors_allowed_origins="*",
        async_mode=async_mode,
        logger=not app.config.get('TESTING'),
        engineio_logger=False,
        ping_timeout=60,
        ping_interval=25
    )
    
    # Celery
    init_celery(app)
    
    # Middleware & Error Handlers
    register_error_handlers(app)
    
    # Routes
    register_blueprints(app)
    
    # Socket handlers
    register_socket_handlers(socketio)
    
    # Database context
    with app.app_context():
        db.create_all()
    
    return app
