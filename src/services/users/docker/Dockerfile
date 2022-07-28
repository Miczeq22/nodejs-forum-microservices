ARG IMAGE=node:14.17.0-alpine
FROM $IMAGE AS users-builder

ENV APP_PORT=4000

WORKDIR /app

RUN apk add --update python3 make g++\
    && rm -rf /var/cache/apk/*

RUN npm i -g @microsoft/rush

RUN apk add --no-cache bash curl git py-pip make && \ 
    npx node-prune && \
    npm install node-dev -g && \
    npm cache clean --force


FROM users-builder

COPY ./src/building-blocks ./app/src/building-blocks

COPY ./src/services/users ./app/src/services/users

COPY ./src/services/users/docker/rush.json ./app/src/services/users/

RUN cd app/src/services/users && rush update --purge && rush build

EXPOSE $APP_PORT

USER node

CMD ["node", "app/src/services/users/dist"]