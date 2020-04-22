from app import db
from flask import request, jsonify, current_app
from app.auth import auth as bp
from app.auth.models import User, UserToken
from app.auth.token import get_jwt, get_token, check_token
from functools import wraps
import datetime
import jwt


def token_required(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
            try:
                payload = jwt.decode(token, current_app.config['SECRET_KEY'])
                user = User.query.filter_by(user_id=payload['userID']).first()
                return f(current_user=user, *args, **kwargs)
            except :
                return jsonify({'error': 'Invalid token'}), 401
        else:
            return jsonify({'error': 'Invalid'}), 401
    return wrapped


@bp.route('/sign', methods=['POST'])
def sign():
    data = request.get_json()
    fb_id = data.get('userID', None)
    name = data.get('name', None)
    email = data.get('email', None)
    picture = data.get('picture', None)
    accessToken = data.get('accessToken', None)

    if not check_token(accessToken, name, fb_id):
        return jsonify({'error': 'Invalid'}), 401

    if fb_id and name and picture and accessToken:
        user = User.query.filter_by(user_id=fb_id).first()
        if user:
            if user.avatar != picture['data']['url']:
                user.avatar = picture['data']['url']
                db.session.commit()
            user_token = UserToken.query.filter_by(user_id=fb_id).first()
            if user_token:
                if user_token.check_date():
                    return jsonify({'token': user.get_jwt()})
                else:
                    user_token.refresh(accessToken)
                    return jsonify({'token': user.get_jwt()})
            else:
                new_token = UserToken()
                new_token.user_id = user.user_id
                data = get_token(accessToken)
                if data.get('error', None):
                    return jsonify({'error': 'token out of date'}), 401
                new_token.access_token = data.get('access_token', None)
                new_token.date = (
                    datetime.datetime.now()
                    + datetime.timedelta(
                          seconds=data.get('expires_in', 0)
                      )
                )
                db.session.add(new_token)
                db.session.commit()
                return jsonify({'token': user.get_jwt()})
        else:
            new_user = User()
            new_user.user_id = fb_id
            new_user.name = name
            new_user.email = email
            new_user.avatar = picture['data']['url']
            new_token = UserToken()
            new_token.user_id = new_user.user_id
            data = get_token(accessToken)
            if data.get('error', None):
                return jsonify({'error': 'token out of date'}), 401
            new_token.access_token = data.get('access_token', None)
            new_token.date = (
                datetime.datetime.now()
                + datetime.timedelta(
                      seconds=data.get('expires_in', 0)
                  )
            )
            db.session.add(new_user)
            db.session.commit()
            db.session.add(new_token)
            db.session.commit()
            return jsonify({'token': new_user.get_jwt()})
    else:
        return jsonify({'error': 'Invalid data'}), 401


@bp.route('/token', methods=['GET'])
@token_required
def get_facebook_token(current_user):
    user_token = UserToken.query.filter_by(user_id=current_user.user_id).first()
    return jsonify({'access_token': user_token.access_token})
