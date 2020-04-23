from flask import request, jsonify, current_app
from app import socketio, db
from flask_socketio import emit, join_room, leave_room
from functools import wraps
from app.auth.models import User
import jwt

def check_token(data):
    token = data.get('token', None)
    if token:
        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'])
            user = User.query.filter_by(user_id=payload['userID']).first()
            return user
        except Exception as val:
            return False
    else:
        return False

@socketio.on('get')
def get_known_room(data):
    user = check_token(data)
    if user:
        known_rooms = []
        for room in user.known_rooms:
            known_rooms.append({'room_id': room.id,
                                'user': room.unknown_user.get_dict()})
        unknown_rooms = []
        for room in user.unknown_rooms:
            unknown_rooms.append({'room_id': room.id,
                                  'user': {'name': hash(room.known_user.name)}})
        emit('handle_room', {'known_rooms': known_rooms, 'unknown_rooms': unknown_rooms}, broadcasts=True)
    else:
        return jsonify({'error': 'Invalid'}), 400