from app import db
from flask_sqlalchemy import sqlalchemy
from app.auth.token import get_token, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
import requests
import datetime


class AdminUser(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return '<Admin {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(sqlalchemy.BIGINT, unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False, index=True)
    email = db.Column(db.Text)
    avatar = db.Column(db.Text, nullable=False)
    token_data = db.relationship('UserToken', backref='user',
                                 uselist=False)
    favorites = db.relationship('Favorite', foreign_keys='Favorite.user_id' ,backref='user')
    favorited = db.relationship('Favorite', foreign_keys='Favorite.favorite' ,backref='user_favorite')
    known_rooms = db.relationship('Room', foreign_keys='Room.user_id', backref='known_user')
    unknown_rooms = db.relationship('Room', foreign_keys='Room.private_user', backref='unknown_user')

    def __repr__(self):
        return '<User {0}-{1}>'.format(self.name, self.user_id)

    def get_dict(self):
        result = {}
        result['userID'] = self.user_id
        result['name'] = self.name
        result['email'] = self.email
        result['avatar'] = self.avatar
        return result

    def get_jwt(self):
        json_token = get_jwt(self.get_dict())
        return json_token.decode('utf-8')


class UserToken(db.Model):
    __tablename__ = 'user_tokens'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(sqlalchemy.BIGINT, db.ForeignKey('users.user_id'))
    access_token = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime)

    def __repr__(self):
        return '<UserToken {}>'.format(self.user.name)

    def get_dict(self):
        return {'access_token': self.access_token,
                'date': self.date}

    def check_date(self):
        return self.date > datetime.datetime.now()

    def refresh(self, access_token):
        data = get_token(access_token)
        token = data.get('access_token', None)
        expires_in = data.get('expires_in', None)
        if token and expires_in:
            self.access_token = token
            self.date = (datetime.datetime.now()
                         + datetime.timedelta(seconds=expires_in))
            db.session.commit()
            return True, self.get_dict()
        else:
            return False, 'Some thing wrong'


class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(sqlalchemy.BIGINT, db.ForeignKey('users.user_id'))
    favorite = db.Column(sqlalchemy.BIGINT, db.ForeignKey('users.user_id'))

    def _repr__(self):
        return '<Favorite {}>'.format(self.user.name)

    @staticmethod
    def create_new(user_id, favorite):
        new_favorite = Favorite()
        new_favorite.user_id = user_id
        new_favorite.favorite = favorite
        db.session.add(new_favorite)
        db.session.commit()

    @staticmethod
    def delete_one(favorite):
        db.session.delete(favorite)
        db.session.commit()
