import os
import logging

logger = logging.getLogger(__name__)


def _get_or_init_firebase_app():
    """Return the default Firebase app, initializing it if necessary."""
    try:
        import firebase_admin
        from firebase_admin import credentials
    except ImportError as exc:
        raise RuntimeError('firebase-admin package is not installed.') from exc

    try:
        return firebase_admin.get_app()
    except ValueError:
        pass  # App not yet initialized

    project_id = os.getenv('FIREBASE_PROJECT_ID')
    private_key = os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n')
    private_key_id = os.getenv('FIREBASE_PRIVATE_KEY_ID', '')
    client_email = os.getenv('FIREBASE_CLIENT_EMAIL')

    if not all([project_id, private_key, client_email]):
        raise RuntimeError(
            'Firebase credentials are not configured. '
            'Set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL.'
        )

    cred = credentials.Certificate({
        'type': 'service_account',
        'project_id': project_id,
        'private_key_id': private_key_id,
        'private_key': private_key,
        'client_email': client_email,
        'token_uri': 'https://oauth2.googleapis.com/token',
    })
    return firebase_admin.initialize_app(cred)


def verify_firebase_token(id_token: str) -> dict:
    """Verify a Firebase ID token and return the decoded payload."""
    try:
        from firebase_admin import auth
    except ImportError as exc:
        raise RuntimeError('firebase-admin package is not installed.') from exc

    try:
        _get_or_init_firebase_app()
        decoded = auth.verify_id_token(id_token)
        return decoded
    except Exception as e:
        logger.error('Firebase token verification error: %s', e)
        raise
