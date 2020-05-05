FROM python:3.7.2-stretch

ADD main.py config.py requirements.txt supervisord.conf start.sh /code/

ADD app /code/app/

WORKDIR /code

RUN pip install -r requirements.txt

RUN chmod u+x ./start.sh

ENV SECRET_KEY=alsdfjlasdkjfoiwjfewfjasdlfjasdasdlfjasdlkfjiowefjwojfwiojfawjfalksdjfalskdjf

EXPOSE $POST

CMD flask db init && flask db migrate && flask db upgrade && gunicorn --worker-class eventlet -w 1 main:app --bind 0.0.0.0:$PORT --reload
