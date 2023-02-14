FROM node:latest as build-stage

ARG BASEPATH='./milestone-tracker-frontend'

ARG SUPABASE_URL=''
ARG SUPABASE_ANON_KEY=''
ARG LOCAL_BASEURL=''
ARG MAX_MILESTONE_BUDGET=0.30

WORKDIR /app
COPY $BASEPATH/package*.json ./
RUN npm install
COPY $BASEPATH .
RUN sh -c 'echo VITE_SUPABASE_URL=$SUPABASE_URL > .env.production'
RUN sh -c 'echo VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY >> .env.production'
RUN sh -c 'echo VITE_LOCAL_BASEURL=$LOCAL_BASEURL >> .env.production'
RUN sh -c 'echo VITE_MAX_MILESTONE_BUDGET=$MAX_MILESTONE_BUDGET >> .env.production'
RUN sh -c 'cat .env.production'
RUN npm run build

FROM nginx as production-stage

ARG BASEPATH='./milestone-tracker-frontend'

RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY $BASEPATH/nginx.conf /etc/nginx/nginx.conf
