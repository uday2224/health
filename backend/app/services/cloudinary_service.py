import os
import cloudinary
import cloudinary.uploader
import logging

logger = logging.getLogger(__name__)


def _configure():
    cloudinary.config(
        cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
        api_key=os.getenv('CLOUDINARY_API_KEY'),
        api_secret=os.getenv('CLOUDINARY_API_SECRET'),
        secure=True,
    )


def upload_image(file, folder: str = 'uploads', public_id: str = None, **kwargs) -> dict:
    """Upload an image file to Cloudinary and return the result dict."""
    _configure()
    options = {
        'folder': folder,
        'overwrite': True,
        'resource_type': 'image',
        'quality': 'auto',
        'fetch_format': 'auto',
    }
    if public_id:
        options['public_id'] = public_id
    options.update(kwargs)

    try:
        result = cloudinary.uploader.upload(file, **options)
        return result
    except Exception as e:
        logger.error('Cloudinary upload failed: %s', e)
        raise


def delete_image(public_id: str) -> dict:
    """Delete an image from Cloudinary by public_id."""
    _configure()
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result
    except Exception as e:
        logger.error('Cloudinary delete failed: %s', e)
        raise
