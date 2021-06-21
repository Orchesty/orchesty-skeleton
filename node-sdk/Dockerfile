FROM node:slim as precache

RUN apt-get update && apt-get update && apt-get install -y yarn

RUN yarn set version berry
RUN yarn set version 2.4.2

# Install node packages
WORKDIR /tmp/_node
COPY ./.yarn ./.yarn/
COPY ./.yarnrc.yml ./
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install

FROM node:slim as build

WORKDIR /srv/app
COPY --from=precache /tmp/_node /srv/app
COPY ./ /srv/app

RUN ./node_modules/.bin/tsc --project ./

FROM node:slim as prod

ENV APP_PORT=8000
ENV NODE_ENV=prod

WORKDIR /srv/app
COPY --from=build /srv/app/dist/src /srv/app
COPY --from=precache /tmp/_node /srv/app


CMD node index.js
