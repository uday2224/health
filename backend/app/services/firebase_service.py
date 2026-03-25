import os
import logging

logger = logging.getLogger(__name__)


def verify_firebase_token(id_token: str) -> dict:
    """Verify a Firebase ID token and return the decoded payload."""
    try:
        import firebase_admin
        from firebase_admin import auth, credentials

        if not firebase_admin._apps:
            cred = credentials.Certificate({
                'type': 'service_account',
                'project_id': os.getenv('FIREBASE_PROJECT_ID'),
                'private_key': os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n'),
                'client_email': os.getenv('FIREBASE_CLIENT_EMAIL'),
                'token_uri': 'https://oauth2.googleapis.com/token',
            })
            firebase_admin.initialize_app(cred)

        decoded = auth.verify_id_token(id_token)
        return decoded
    except Exception as e:
        logger.error('Firebase token verification error: %s', e)
        raise
