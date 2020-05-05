#!/bin/sh
flask db init
flask db migrate
flask db upgrade
gunicorn --worker-class eventlet -w 1 main:app -b 0.0.0.0:$POST
