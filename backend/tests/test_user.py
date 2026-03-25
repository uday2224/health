"""Tests for user endpoints."""
import json
import pytest


class TestUserProfile:
    def test_get_profile(self, client, sample_user, auth_headers):
        res = client.get('/api/user/profile', headers=auth_headers)
        assert res.status_code == 200
        body = res.get_json()
        assert body['success'] is True
        assert body['data']['full_name'] == sample_user.full_name

    def test_get_profile_unauthenticated(self, client):
        res = client.get('/api/user/profile')
        assert res.status_code == 401

    def test_update_profile(self, client, sample_user, auth_headers):
        res = client.put('/api/user/profile',
                         data=json.dumps({'full_name': 'Updated Name', 'blood_group': 'O+'}),
                         content_type='application/json',
                         headers=auth_headers)
        assert res.status_code == 200
        body = res.get_json()
        assert body['success'] is True
        assert body['data']['full_name'] == 'Updated Name'
        assert body['data']['blood_group'] == 'O+'


class TestAddresses:
    def test_add_address(self, client, sample_user, auth_headers):
        payload = {
            'label': 'Home',
            'house_no': '12A',
            'street': 'MG Road',
            'city': 'Bangalore',
            'pincode': '560001',
            'lat': 12.9716,
            'lng': 77.5946,
            'is_default': True,
        }
        res = client.post('/api/user/addresses',
                          data=json.dumps(payload),
                          content_type='application/json',
                          headers=auth_headers)
        assert res.status_code == 201
        body = res.get_json()
        assert body['success'] is True
        assert body['data']['city'] == 'Bangalore'

    def test_get_addresses(self, client, sample_user, auth_headers):
        res = client.get('/api/user/addresses', headers=auth_headers)
        assert res.status_code == 200
        body = res.get_json()
        assert body['success'] is True
        assert isinstance(body['data'], list)


class TestNotifications:
    def test_get_notifications_empty(self, client, sample_user, auth_headers):
        res = client.get('/api/user/notifications', headers=auth_headers)
        assert res.status_code == 200
        body = res.get_json()
        assert body['success'] is True
        assert body['data'] == []
        assert 'pagination' in body
