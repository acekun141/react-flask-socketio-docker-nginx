from flask import request, jsonify, current_app
from app import socketio, db
from flask_socketio import emit, join_room, leave_room
from functools import wraps
from app.auth.models import User
from app.chat.models import Room, Message
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


@socketio.on('join')
def join(data):
    current_user = check_token(data)
    room_id = data.get('room_id', None)
    if current_user and room_id:
        print(room_id)
        join_room(room_id)


@socketio.on('leave')
def leave(data):
    current_user = check_token(data)
    room_id = data.get('room_id', None)
    if current_user and room_id:
        print(room_id)
        leave_room(room_id)

    
@socketio.on('receive_message')
def receive_message(data):
    current_user = check_token(data)
    if current_user:
        message = data.get('message')
        room_id = data.get('room_id')
        if message and room_id:
            room = (Room.query.filter_by(
                        id=room_id, user_id=current_user.user_id).first()
                    or Room.query.filter_by(
                        id=room_id, private_user=current_user.user_id).first()
                    )
            if room:
                new_message = Message.create_new(current_user, room, message)
                emit('send_message', {'message': new_message.message,
                                      'user_id': current_user.user_id,
                                      'date': new_message.date.strftime("%a, %d %b %Y %H:%M:%S GMT"),
                                      'id': new_message.id}, room=room_id)
