from app import db
from app.auth.models import User
import datetime


class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    private_user = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user_seen = db.Column(db.Boolean)
    private_seen = db.Column(db.Boolean)
    date = db.Column(db.DateTime)
    messages = db.relationship('Message', backref='room')

    def __repr__(self):
        return '<Room {}-{}>'.format(self.known_user, self.unknown_user)

    def setUserSeen(self):
        self.user_seen = not self.user_seen
    
    def setPrivateSeen(self):
        self.private_seen = not self.private_seen
    
    @staticmethod
    def create_new(user_id, private_user):
        new_room = Room()
        new_room.user_id = user_id
        new_room.private_user = private_user
        new_room.user_seen = False
        new_room.private_seen = False
        new_room.date = datetime.datetime.now()
        db.session.add(new_room)
        db.session.commit()

        return new_room


class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.user_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    to_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    message = db.Column(db.String(500))
    date = db.Column(db.DateTime)

    def __repr__(self):
        return '<Message {}>'.format(self.room)
    
    def get_dict(self):
        result = {}
        result['id'] = self.id
        if self.user_id == self.room.user_id:
            result['user_id'] = False 
        result['user_id'] = self.user_id
        result['message'] = self.message
        result['date'] = self.date

        return result
    
    @staticmethod
    def create_new(user, to_user, room, message):
        if len(message) > 500:
            message = message[:500]
        new_message = Message()
        new_message.user_id = user.user_id
        new_message.to_user_id = to_user.user_id
        new_message.message = message
        new_message.room = room
        new_message.date = datetime.datetime.now()
        room.date = new_message.date
        db.session.add(new_message)
        db.session.commit()
