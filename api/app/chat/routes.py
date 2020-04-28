from flask import request, jsonify
from flask_sqlalchemy import sqlalchemy
from app.chat import chat as bp
from app.chat.models import Message, Room
from app.auth.routes import token_required
from app.auth.models import User, UserToken
import datetime


@bp.route('/room', methods=['GET'])
@token_required
def get_all_room(current_user):
    known_rooms = []
    unknown_rooms = []
    for room in current_user.known_rooms:
        known_rooms.append({'room_id': room.id, 'user': room.unknown_user.get_dict()})
    for room in current_user.unknown_rooms:
        unknown_rooms.append({'room_id': room.id, 'user': {'name': hash(room.known_user.name)}})

    return jsonify({'known_rooms': known_rooms, 'unknown_rooms': unknown_rooms})


@bp.route('/room', methods=['POST'])
@token_required
def get_room(current_user):
    data = request.get_json()
    user_id = data.get('user_id')
    if user_id and user_id != current_user.user_id:
        user = User.query.filter_by(user_id=user_id).first()
        if user:
            room = Room.query.filter_by(
                user_id=current_user.user_id,
                private_user=user_id
                ).first()
            if room:
                return jsonify({'room': room.id,
                                'user_id': room.user_id,
                                'private_user': room.private_user})
            else:
                new_room = Room.create_new(user_id=current_user.user_id, private_user=user_id)
                return jsonify({'room': new_room.id,
                                'user_id': new_room.user_id,
                                'private_user': new_room.private_user})
    
    return jsonify({'error': 'Invalid'}), 401


@bp.route('/room/<int:room_id>', methods=['GET'])
@token_required
def get_room_detail(current_user, room_id):
    try:
        room_id = int(room_id)
        room = (Room.query.filter_by(user_id=current_user.user_id,id=room_id).first()
                or Room.query.filter_by(private_user=current_user.user_id,id=room_id).first())
        if room:
            if room.user_id == current_user.user_id:
                return jsonify({'room_id': room.id, 'user': {'name': room.unknown_user.name, 'avatar': room.unknown_user.avatar}})
            else:
                return jsonify({'room_id': room.id, 'user': {'name': hash(room.known_user.name)}})
        raise Exception('error')
    except:
        return jsonify({'error': 'Invalid'}), 401


@bp.route('/message', methods=['GET'])
@token_required
def get_messages(current_user):
    room_id = request.headers.get('room_id')
    page = request.headers.get('page')
    len_new = request.headers.get('len_new')
    if room_id:
        room = (Room.query.filter_by(user_id=current_user.user_id,id=room_id).first()
                or Room.query.filter_by(private_user=current_user.user_id,id=room_id).first())
        if room:
            try: 
                messages = Message.query.filter_by(room=room).order_by(
                    sqlalchemy.desc(Message.date)).paginate(page=int(page), per_page=10+int(len_new))
            except Exception as value:
                messages = Message.query.filter_by(room=room).order_by(
                    sqlalchemy.desc(Message.date)).paginate(page=1, per_page=10)
            if messages.has_next:
                result = []
                for message in messages.items[:10]:
                    result.append(message.get_dict())
                return jsonify({'messages': result, 'next': int(page)+1})
            else:
                result = []
                for message in messages.items:
                    result.append(message.get_dict())
                return jsonify({'messages': result})

    return jsonify({'error': 'Invalid'}), 401