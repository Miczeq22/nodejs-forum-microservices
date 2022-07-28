ARG IMAGE=node:14.17.0-alpine
FROM $IMAGE AS builder

ENV APP_PORT=4000

WORKDIR /app

RUN npm i -g @microsoft/rush

RUN apk add --no-cache bash curl git py-pip make && \ 
    npx node-prune && \
    npm install node-dev -g && \
    npm cache clean --force

FROM builder

COPY ./src/building-blocks ./app/src/building-blocks

COPY ./src/services/posts ./app/src/services/posts

COPY ./src/services/posts/docker/rush.json ./app/src/services/posts/

RUN cd app/src/services/posts && rush update && rush build

EXPOSE $APP_PORT

USER node

CMD ["node", "app/src/services/posts/dist"]