FROM node:lts-alpine

WORKDIR /usr/src/app

COPY --chown=node:node ./package.json ./
COPY --chown=node:node ./server.js ./
COPY --chown=node:node ./src ./src

RUN npm install -g npm@latest
RUN npm install --omit=dev

USER node

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE ${PORT}

ENTRYPOINT npm start