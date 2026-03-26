from flask import jsonify
import math


def success_response(data=None, message='Success', status_code=200, pagination=None):
    """Return a standardized success JSON response."""
    response = {
        'success': True,
        'message': message,
        'data': data,
    }
    if pagination is not None:
        response['pagination'] = pagination
    return jsonify(response), status_code


def error_response(message='Error', data=None, status_code=400):
    """Return a standardized error JSON response."""
    return jsonify({
        'success': False,
        'message': message,
        'data': data,
    }), status_code


def paginate(query, page, per_page=20, max_per_page=100):
    """Paginate a SQLAlchemy query and return (items, pagination_meta)."""
    per_page = min(int(per_page), max_per_page)
    page = max(int(page), 1)

    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    total_pages = math.ceil(total / per_page) if per_page else 1

    pagination = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': total_pages,
        'has_next': page < total_pages,
        'has_prev': page > 1,
    }
    return items, pagination
