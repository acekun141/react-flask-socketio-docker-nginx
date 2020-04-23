from app import db
from app.auth.models import User


class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    private_user = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user_seen = db.Column(db.Boolean)
    private_seen = db.Column(db.Boolean)
    messages = db.relationship('Message', backref='room')

    def __repr__(self):
        return '<Room {}-{}>'.format(self.known_user, self.unknown_user)


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