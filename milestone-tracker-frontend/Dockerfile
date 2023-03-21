FROM node:latest as build-stage

ARG BASEPATH='./milestone-tracker-frontend'

WORKDIR /app
COPY $BASEPATH/package*.json ./
RUN npm install
COPY $BASEPATH .
RUN npm run build
RUN npx vue-inject-env set

FROM nginx as production-stage

ARG BASEPATH='./milestone-tracker-frontend'

RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY $BASEPATH/nginx.conf /etc/nginx/nginx.conf
