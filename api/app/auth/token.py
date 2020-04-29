from flask import current_app, jsonify
import requests
import jwt

APP_ID = "567500377224019"
APP_SECRET = "b0de99d0150c7adcaf72c973f7713813"


def get_jwt(data):
    encode_jwt = jwt.encode(data, current_app.config['SECRET_KEY'])
    return encode_jwt

def check_token(access_token, name, user_id):
    url = "https://graph.facebook.com/v6.0/me?fields=id%2Cname&access_token={}".format(access_token)
    response = requests.get(url)
    data = response.json()
    if "id" in data and "name" in data:
        if data["id"] == str(user_id) and data["name"] == name:
            return True

    return False


def get_token(access_token):
    url = ("https://graph.facebook.com/v6.0/oauth/access_token?"
    + "grant_type=fb_exchange_token&"
    + "client_id={}&".format(APP_ID)
    + "client_secret={}&".format(APP_SECRET)
    + "fb_exchange_token={}".format(access_token))

    response = requests.get(url)
    data = response.json()

    return data

