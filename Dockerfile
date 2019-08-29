# Dev server must be containerized
FROM node:12-alpine as Dev

WORKDIR /home/node/app

RUN apk add --no-cache build-base openssl-dev \
    && npm install -g @vue/cli \
    && npm install -g @vue/cli-service-global \
    && apk del build-base openssl-dev

COPY ./package.json ./package-lock.json* ./

ENV NODE_ENV development

RUN apk add --no-cache build-base \
    && npm install \
    && apk del build-base

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/npm"]

CMD ["run-script", "serve"]
