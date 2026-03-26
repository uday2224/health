import pytest
from app import create_app
from app.extensions import db as _db


@pytest.fixture(scope='session')
def app():
    """Create Flask app configured for testing."""
    flask_app = create_app('testing')
    flask_app.config['TESTING'] = True
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    flask_app.config['JWT_SECRET_KEY'] = 'test-secret'
    flask_app.config['WTF_CSRF_ENABLED'] = False

    ctx = flask_app.app_context()
    ctx.push()

    _db.create_all()
    yield flask_app

    _db.session.remove()
    _db.drop_all()
    ctx.pop()


@pytest.fixture(scope='function')
def db(app):
    """Provide a clean database for each test."""
    yield _db
    _db.session.rollback()


@pytest.fixture(scope='function')
def client(app):
    """Provide a test client."""
    return app.test_client()


@pytest.fixture(scope='function')
def sample_user(db):
    """Create and return a sample patient user."""
    from app.models.user import User
    user = User(
        phone='+911234567890',
        full_name='Test Patient',
        role='PATIENT',
    )
    db.session.add(user)
    db.session.commit()
    yield user
    db.session.delete(user)
    db.session.commit()


@pytest.fixture(scope='function')
def auth_headers(app, sample_user):
    """Return Authorization headers for sample_user."""
    from flask_jwt_extended import create_access_token
    with app.app_context():
        token = create_access_token(identity=sample_user.id)
    return {'Authorization': f'Bearer {token}'}
