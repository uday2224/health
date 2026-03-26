from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from flask_migrate import Migrate
from celery import Celery
import os

db = SQLAlchemy()
jwt = JWTManager()
socketio = SocketIO()
migrate = Migrate()
celery = Celery(__name__)

# Redis client — created lazily on first access so env vars are resolved at
# runtime rather than at import time (important when using python-dotenv).
_redis_client = None


def get_redis_client():
    """Return a shared Redis client, creating it on first call."""
    global _redis_client
    if _redis_client is None:
        from redis import Redis
        _redis_client = Redis.from_url(
            os.getenv('REDIS_URL', 'redis://localhost:6379/0'),
            decode_responses=True,
        )
    return _redis_client


def init_celery(app):
    """Initialize Celery with Flask app context and Celery 5.x config."""
    celery.conf.update(
        broker_url=app.config.get('CELERY_BROKER_URL', app.config.get('REDIS_URL')),
        result_backend=app.config.get('CELERY_RESULT_BACKEND', app.config.get('REDIS_URL')),
        beat_schedule=app.config.get('CELERY_BEAT_SCHEDULE', {}),
        task_serializer='json',
        result_serializer='json',
        accept_content=['json'],
        timezone='Asia/Kolkata',
    )

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery
