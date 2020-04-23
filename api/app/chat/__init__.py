from flask import Blueprint

chat = Blueprint('chat', __name__, url_prefix='/chat')

from app.chat import models, routes, events