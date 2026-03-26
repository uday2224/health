from flask_socketio import emit, join_room, leave_room
import logging

logger = logging.getLogger(__name__)


def register_socket_handlers(socketio):
    """Register all Socket.IO event handlers."""

    @socketio.on('connect')
    def handle_connect(auth):
        logger.info('Client connected: %s', auth)
        emit('connected', {'message': 'Connected to TezHealth socket server'})

    @socketio.on('disconnect')
    def handle_disconnect():
        logger.info('Client disconnected')

    @socketio.on('join_room')
    def handle_join_room(data):
        room = data.get('room')
        if room:
            join_room(room)
            emit('room_joined', {'room': room}, room=room)
            logger.info('Client joined room: %s', room)

    @socketio.on('leave_room')
    def handle_leave_room(data):
        room = data.get('room')
        if room:
            leave_room(room)
            emit('room_left', {'room': room})
            logger.info('Client left room: %s', room)

    @socketio.on('nurse_location_update')
    def handle_nurse_location(data):
        """Nurse broadcasts real-time location during active booking."""
        booking_id = data.get('booking_id')
        if booking_id:
            room = f'booking_{booking_id}'
            emit('nurse_location', data, room=room)

    @socketio.on('booking_status_update')
    def handle_booking_status(data):
        """Broadcast booking status change to patient room."""
        booking_id = data.get('booking_id')
        patient_id = data.get('patient_id')
        if booking_id:
            room = f'patient_{patient_id}'
            emit('booking_updated', data, room=room)
