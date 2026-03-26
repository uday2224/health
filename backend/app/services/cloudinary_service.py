import os
import logging

logger = logging.getLogger(__name__)

_configured = False


def _configure():
    """Configure Cloudinary once using environment variables."""
    global _configured
    if _configured:
        return

    try:
        import cloudinary
    except ImportError as exc:
        raise RuntimeError('cloudinary package is not installed.') from exc

    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')

    if not all([cloud_name, api_key, api_secret]):
        raise RuntimeError(
            'Cloudinary credentials are not configured. '
            'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
        )

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True,
    )
    _configured = True


def upload_image(file, folder: str = 'uploads', public_id: str = None, **kwargs) -> dict:
    """Upload an image file to Cloudinary and return the result dict."""
    import cloudinary.uploader
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
    import cloudinary.uploader
    _configure()
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result
    except Exception as e:
        logger.error('Cloudinary delete failed: %s', e)
        raise
