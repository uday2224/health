from flask import jsonify
from flask_jwt_extended.exceptions import JWTExtendedException
from marshmallow import ValidationError
import logging

logger = logging.getLogger(__name__)


def register_error_handlers(app):
    """Register global error handlers for the Flask app."""

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({
            'success': False,
            'message': str(e.description) if hasattr(e, 'description') else 'Bad request',
            'data': None
        }), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({
            'success': False,
            'message': 'Unauthorized',
            'data': None
        }), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({
            'success': False,
            'message': 'Forbidden',
            'data': None
        }), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            'success': False,
            'message': 'Resource not found',
            'data': None
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({
            'success': False,
            'message': 'Method not allowed',
            'data': None
        }), 405

    @app.errorhandler(422)
    def unprocessable_entity(e):
        return jsonify({
            'success': False,
            'message': 'Unprocessable entity',
            'data': None
        }), 422

    @app.errorhandler(429)
    def too_many_requests(e):
        return jsonify({
            'success': False,
            'message': 'Too many requests. Please slow down.',
            'data': None
        }), 429

    @app.errorhandler(500)
    def internal_server_error(e):
        logger.exception('Internal server error: %s', e)
        return jsonify({
            'success': False,
            'message': 'Internal server error',
            'data': None
        }), 500

    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        return jsonify({
            'success': False,
            'message': 'Validation error',
            'data': e.messages
        }), 400

    @app.errorhandler(JWTExtendedException)
    def handle_jwt_error(e):
        return jsonify({
            'success': False,
            'message': str(e),
            'data': None
        }), 401
