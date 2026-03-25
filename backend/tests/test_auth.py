"""Tests for authentication endpoints."""
import json
import pytest
from unittest.mock import patch, MagicMock


class TestVerifyOTP:
    def test_verify_otp_missing_token(self, client):
        res = client.post('/api/auth/verify-otp',
                          data=json.dumps({}),
                          content_type='application/json')
        assert res.status_code == 400
        data = res.get_json()
        assert data['success'] is False
        assert 'id_token' in data['message']

    def test_verify_otp_invalid_token(self, client):
        with patch('app.services.firebase_service.verify_firebase_token',
                   side_effect=Exception('invalid token')):
            res = client.post('/api/auth/verify-otp',
                              data=json.dumps({'id_token': 'bad-token'}),
                              content_type='application/json')
        assert res.status_code == 401
        assert res.get_json()['success'] is False

    def test_verify_otp_new_user(self, client, db):
        mock_decoded = {
            'uid': 'firebase-uid-123',
            'phone_number': '+910000000001',
        }
        with patch('app.services.firebase_service.verify_firebase_token',
                   return_value=mock_decoded):
            res = client.post('/api/auth/verify-otp',
                              data=json.dumps({'id_token': 'valid-token'}),
                              content_type='application/json')

        assert res.status_code == 200
        body = res.get_json()
        assert body['success'] is True
        assert body['data']['is_new_user'] is True
        assert 'access_token' in body['data']
        assert 'refresh_token' in body['data']


class TestMe:
    def test_me_unauthenticated(self, client):
        res = client.get('/api/auth/me')
        assert res.status_code == 401

    def test_me_authenticated(self, client, sample_user, auth_headers):
        res = client.get('/api/auth/me', headers=auth_headers)
        assert res.status_code == 200
        body = res.get_json()
        assert body['success'] is True
        assert body['data']['phone'] == sample_user.phone


class TestRefreshToken:
    def test_refresh_token(self, app, client, sample_user):
        from flask_jwt_extended import create_refresh_token
        with app.app_context():
            refresh = create_refresh_token(identity=sample_user.id)

        res = client.post('/api/auth/refresh-token',
                          headers={'Authorization': f'Bearer {refresh}'})
        assert res.status_code == 200
        body = res.get_json()
        assert body['success'] is True
        assert 'access_token' in body['data']


class TestLogout:
    def test_logout(self, client, auth_headers):
        res = client.post('/api/auth/logout', headers=auth_headers)
        assert res.status_code == 200
        assert res.get_json()['success'] is True
