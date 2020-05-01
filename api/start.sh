#!/bin/sh
flask db init
flask db migrate
flask db upgrade
uwsgi --http :5000 --gevent 1000 --http-websockets --master --wsgi-file main.py --callable app