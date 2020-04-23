from app import db
from app.auth.models import User


class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    private_user = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user_seen = db.Column(db.Boolean)
    private_seen = db.Column(db.Boolean)


class Name(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    to_user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    message = db.Column(db.String(500))
    date = db.Column(db.DateTime)