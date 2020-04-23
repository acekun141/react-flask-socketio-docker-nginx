from flask import request, jsonify
from flask_sqlalchemy import sqlalchemy
from app.chat import chat as bp
from app.chat.models import Message, Room
from app.auth.routes import token_required
from app.auth.models import User, UserToken
import datetime

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


@bp.route('/message', methods=['POST'])
@token_required
def send_message(current_user):
    data = request.get_json()
    message = data.get('message')
    user_id = data.get('user_id')
    room_id = data.get('room_id')
    if message and user_id:
        user = User.query.filter_by(user_id=user_id).first()
        room = (Room.query.filter_by(
                    id=room_id, user_id=current_user.user_id,
                    private_user=user_id).first()
                or Room.query.filter_by(
                    id=room_id, user_id=user_id,
                    private_user=current_user.user_id)
                )
        if user and room:
            Message.create_new(current_user, user, room, message)
            return jsonify({'message': message, 'user_id': current_user.user_id})
    return jsonify({'error': 'Invalid'}), 401


@bp.route('/message', methods=['GET'])
@token_required
def get_messages(current_user):
    data = request.get_json()
    room_id = data.get('room_id')
    page = data.get('page')
    if room_id and page:
        room = (Room.query.filter_by(user_id=current_user.user_id,id=room_id).first()
                or Room.query.filter_by(private_user=current_user.user_id,id=room_id).first())
        if room:
            try: 
                messages = Message.query.order_by(
                    sqlalchemy.desc(Message.date)).paginate(page=page, per_page=10)
            except:
                return jsonify({'messages': []})
            if messages.has_next:
                result = []
                for message in messages.items:
                    result.append(message.get_dict())
                return jsonify({'messages': result, 'next': int(page)+1})
            else:
                result = []
                for message in messages.items:
                    result.append(message.get_dict())
                return jsonify({'messages': result})

    return jsonify({'error': 'Invalid'}), 401