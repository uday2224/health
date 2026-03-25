from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_migrate import Migrate
from redis import Redis
from celery import Celery
import os

db = SQLAlchemy()
jwt = JWTManager()
socketio = SocketIO()
migrate = Migrate()
redis_client = Redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'), decode_responses=True)

celery = Celery(__name__)

def init_celery(app):
    """Initialize Celery with Flask app"""
    celery.conf.update(app.config)
    
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
    
    celery.Task = ContextTask
    return celery
