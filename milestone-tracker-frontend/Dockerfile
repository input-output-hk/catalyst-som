FROM node:latest

ARG BASEPATH='./milestone-tracker-frontend'

WORKDIR /app
COPY $BASEPATH/package*.json ./
RUN npm install
COPY $BASEPATH .
RUN npm run build
ENTRYPOINT npx vue-inject-env set && npx http-server dist
