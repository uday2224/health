import base64
import json
import logging
import os
import re
import requests

logger = logging.getLogger(__name__)

# Prompt instructs Claude to return ONLY a JSON object so we can parse it reliably.
_PARSE_PROMPT = """You are a medical prescription parser. Analyze this prescription image and extract all information.

Return ONLY a valid JSON object with these fields (use null for any field that cannot be determined):
{
  "medications": [
    {
      "name": "medication name",
      "dosage": "e.g. 500mg",
      "frequency": "e.g. twice daily",
      "duration": "e.g. 7 days",
      "instructions": "e.g. take after meals"
    }
  ],
  "diagnosis": "primary diagnosis or condition",
  "doctor_name": "prescribing doctor name",
  "doctor_registration": "registration number if visible",
  "hospital": "hospital or clinic name if visible",
  "date": "prescription date in YYYY-MM-DD format or null",
  "patient_name": "patient name if visible",
  "instructions": "general instructions or notes",
  "raw_text": "all readable text from the prescription"
}

Return ONLY the JSON object, with no markdown fences or extra commentary."""


def _get_client():
    """Return an Anthropic client, raising clear errors if misconfigured."""
    try:
        import anthropic
    except ImportError as exc:
        raise RuntimeError('anthropic package is not installed.') from exc

    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        raise RuntimeError(
            'ANTHROPIC_API_KEY environment variable is not set.'
        )
    return anthropic.Anthropic(api_key=api_key)


def _extract_json(text: str) -> dict:
    """Extract and parse the first JSON object found in *text*."""
    text = text.strip()
    # Strip optional markdown code fences
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    text = text.strip()
    if text.startswith('{'):
        return json.loads(text)
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return json.loads(match.group())
    raise ValueError(f'Could not extract JSON from vision response: {text[:300]}')


def parse_prescription_from_bytes(image_bytes: bytes, media_type: str = 'image/jpeg') -> dict:
    """Upload raw image bytes to Claude Vision and return structured prescription data.

    Args:
        image_bytes: Raw binary content of the image file.
        media_type: MIME type of the image (e.g. 'image/jpeg', 'image/png').

    Returns:
        A dict with keys: medications, diagnosis, doctor_name, doctor_registration,
        hospital, date, patient_name, instructions, raw_text.
    """
    client = _get_client()
    encoded = base64.standard_b64encode(image_bytes).decode('ascii')

    try:
        response = client.messages.create(
            model='claude-3-5-sonnet-20241022',
            max_tokens=1500,
            messages=[
                {
                    'role': 'user',
                    'content': [
                        {
                            'type': 'image',
                            'source': {
                                'type': 'base64',
                                'media_type': media_type,
                                'data': encoded,
                            },
                        },
                        {
                            'type': 'text',
                            'text': _PARSE_PROMPT,
                        },
                    ],
                }
            ],
        )
    except Exception as e:
        logger.error('Claude Vision API call failed: %s', e)
        raise

    raw_text = response.content[0].text
    try:
        return _extract_json(raw_text)
    except (json.JSONDecodeError, ValueError) as e:
        logger.error('Failed to parse Claude Vision JSON response: %s', e)
        raise ValueError(f'Vision service returned invalid JSON: {e}') from e


def parse_prescription_from_url(image_url: str) -> dict:
    """Download an image from *image_url* and parse it with Claude Vision.

    Useful when a prescription image has already been uploaded to Cloudinary.
    Falls back to encoding the downloaded bytes as base64 because the Anthropic
    SDK version bundled with this project does not yet support URL-type sources.

    Args:
        image_url: Publicly accessible URL of the prescription image.

    Returns:
        Same dict structure as :func:`parse_prescription_from_bytes`.
    """
    try:
        resp = requests.get(image_url, timeout=15)
        resp.raise_for_status()
    except Exception as e:
        logger.error('Failed to download image from %s: %s', image_url, e)
        raise ValueError(f'Could not download image: {e}') from e

    content_type = resp.headers.get('Content-Type', 'image/jpeg').split(';')[0].strip()
    return parse_prescription_from_bytes(resp.content, media_type=content_type)
