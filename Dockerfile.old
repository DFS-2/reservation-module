FROM node:10.17.0-alpine

ENV NODE_ENV='production'

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

RUN npm install

EXPOSE 3001

RUN apk update && apk add bash

ENTRYPOINT bash -c "./wait-for-it.sh database:3306 && npm run db:setup && npm start"