# stage1 as builder
FROM node:12-alpine as builder

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the dependencies and make the folder
RUN npm install --silent && mkdir /react-ui && mv ./node_modules ./react-ui

WORKDIR /react-ui

COPY package.json .

COPY public ./public/

COPY src ./src/

RUN npm install react-script --silent

RUN npm install -g serve --silent

RUN npm run build

EXPOSE $PORT

CMD serve -s build -l tcp://0.0.0.0:$PORT


# FROM nginx:alpine

# #!/bin/sh

# COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

# ## Remove default nginx index page
# RUN rm -rf /usr/share/nginx/html/*

# # Copy from the stahg 1
# COPY --from=builder /react-ui/build /usr/share/nginx/html

# EXPOSE 3000 80

# ENTRYPOINT ["nginx", "-g", "daemon off;"]
