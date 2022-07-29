ARG IMAGE=node:14.17.0-alpine
FROM $IMAGE AS api-gateway-builder

ENV APP_PORT=4000

WORKDIR /app

RUN apk add --update python3 make g++\
    && rm -rf /var/cache/apk/*

RUN npm i -g @microsoft/rush

RUN apk add --no-cache bash curl git py-pip make && \ 
    npx node-prune && \
    npm install node-dev -g && \
    npm cache clean --force


FROM api-gateway-builder

COPY ./src/building-blocks ./app/src/building-blocks

COPY ./src/api-gateway ./app/src/api-gateway

COPY ./src/api-gateway/docker/rush.json ./app/src/api-gateway/

RUN cd app/src/api-gateway && rush update --purge && rush build

EXPOSE $APP_PORT

USER node

CMD ["node", "app/src/api-gateway/dist"]