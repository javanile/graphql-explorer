FROM node:14

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install

COPY src /app/src
COPY public /app/public

RUN pwd && ls -la  && yarn build

EXPOSE 5677