FROM tiangolo/node-frontend:10 as build-stage

ADD public src package.json /app/

RUN npm install

CMD npm start