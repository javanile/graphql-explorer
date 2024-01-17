FROM node:14

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install

COPY dist /app/dist
COPY src /app/src
COPY public /app/public

RUN pwd && ls -la && yarn build

RUN ls /app/dist && sed 's/localhost/0.0.0.0/' -i /app/dist/index.js

WORKDIR /app/dist

EXPOSE 5677

COPY docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
