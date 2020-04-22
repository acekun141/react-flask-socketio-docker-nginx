from flask import Blueprint

chat = Blueprint('chat', __name__, '/chat')

from app.chat import models, routes