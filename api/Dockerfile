FROM python:3.7.2-stretch

ADD main.py config.py requirements.txt supervisord.conf start.sh /code/

ADD app /code/app/

WORKDIR /code

RUN pip install -r requirements.txt

RUN chmod u+x ./start.sh

CMD ./start.sh