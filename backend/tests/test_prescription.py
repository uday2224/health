"""Tests for prescription endpoints (Claude Vision integration)."""
import io
import json
import pytest
from unittest.mock import patch, MagicMock


# A minimal 1×1 white JPEG in bytes (valid JPEG header so the route accepts it)
_TINY_JPEG = (
    b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00'
    b'\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t'
    b'\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a'
    b'\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),\x01\x02\x03\x04'
    b'\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00'
    b'\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00'
    b'\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b'
    b'\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xf5\x0a\xff\xd9'
)

_MOCK_PARSED = {
    'medications': [{'name': 'Paracetamol', 'dosage': '500mg', 'frequency': 'twice daily',
                     'duration': '5 days', 'instructions': 'after meals'}],
    'diagnosis': 'Fever',
    'doctor_name': 'Dr. Test',
    'doctor_registration': 'KA-12345',
    'hospital': 'Test Hospital',
    'date': '2026-03-26',
    'patient_name': 'Test Patient',
    'instructions': 'Rest and drink fluids',
    'raw_text': 'Paracetamol 500mg twice daily for 5 days',
}


class TestPrescriptionUpload:
    def test_upload_no_file(self, client, auth_headers):
        res = client.post('/api/prescriptions', headers=auth_headers)
        assert res.status_code == 400
        assert res.get_json()['success'] is False

    def test_upload_success(self, client, auth_headers):
        cloud_mock = MagicMock(return_value={'secure_url': 'https://res.cloudinary.com/test/rx.jpg'})
        vision_mock = MagicMock(return_value=_MOCK_PARSED)

        with patch('app.routes.prescription.upload_image', cloud_mock), \
             patch('app.routes.prescription.parse_prescription_from_bytes', vision_mock):
            data = {'file': (io.BytesIO(_TINY_JPEG), 'rx.jpg', 'image/jpeg')}
            res = client.post(
                '/api/prescriptions',
                data=data,
                content_type='multipart/form-data',
                headers=auth_headers,
            )

        assert res.status_code == 201
        body = res.get_json()
        assert body['success'] is True
        assert body['data']['diagnosis'] == 'Fever'
        assert body['data']['medications'][0]['name'] == 'Paracetamol'
        assert body['data']['image_url'] == 'https://res.cloudinary.com/test/rx.jpg'

    def test_upload_vision_failure_still_saves(self, client, auth_headers):
        """If Claude Vision fails, the prescription is saved with empty parsed fields."""
        cloud_mock = MagicMock(return_value={'secure_url': 'https://res.cloudinary.com/test/rx2.jpg'})
        vision_mock = MagicMock(side_effect=Exception('Vision API unreachable'))

        with patch('app.routes.prescription.upload_image', cloud_mock), \
             patch('app.routes.prescription.parse_prescription_from_bytes', vision_mock):
            data = {'file': (io.BytesIO(_TINY_JPEG), 'rx2.jpg', 'image/jpeg')}
            res = client.post(
                '/api/prescriptions',
                data=data,
                content_type='multipart/form-data',
                headers=auth_headers,
            )

        assert res.status_code == 201
        body = res.get_json()
        assert body['success'] is True
        assert body['data']['medications'] == []


class TestPrescriptionCRUD:
    @pytest.fixture(autouse=True)
    def sample_prescription(self, db, sample_user):
        from app.models.prescription import Prescription
        rx = Prescription(
            patient_id=sample_user.id,
            image_url='https://res.cloudinary.com/test/sample.jpg',
            raw_text='Sample raw text',
            parsed_data=_MOCK_PARSED,
            medications=_MOCK_PARSED['medications'],
            diagnosis='Fever',
        )
        db.session.add(rx)
        db.session.commit()
        self.prescription_id = rx.id
        yield rx
        if db.session.get(Prescription, rx.id):
            db.session.delete(rx)
            db.session.commit()

    def test_list_prescriptions(self, client, auth_headers):
        res = client.get('/api/prescriptions', headers=auth_headers)
        assert res.status_code == 200
        body = res.get_json()
        assert body['success'] is True
        assert len(body['data']) >= 1

    def test_get_prescription(self, client, auth_headers):
        res = client.get(f'/api/prescriptions/{self.prescription_id}', headers=auth_headers)
        assert res.status_code == 200
        body = res.get_json()
        assert body['success'] is True
        assert body['data']['id'] == self.prescription_id

    def test_get_prescription_not_found(self, client, auth_headers):
        res = client.get('/api/prescriptions/nonexistent-id', headers=auth_headers)
        assert res.status_code == 404

    def test_delete_prescription(self, client, auth_headers):
        res = client.delete(f'/api/prescriptions/{self.prescription_id}', headers=auth_headers)
        assert res.status_code == 200
        assert res.get_json()['success'] is True

    def test_reparse_prescription(self, client, auth_headers):
        vision_mock = MagicMock(return_value={**_MOCK_PARSED, 'diagnosis': 'Updated Diagnosis'})
        with patch('app.routes.prescription.parse_prescription_from_url', vision_mock):
            res = client.post(
                f'/api/prescriptions/{self.prescription_id}/reparse',
                headers=auth_headers,
            )
        assert res.status_code == 200
        body = res.get_json()
        assert body['success'] is True
        assert body['data']['diagnosis'] == 'Updated Diagnosis'
