FROM node:lts-alpine as builder

WORKDIR /usr/src/app

COPY --chown=node:node *.js .
COPY --chown=node:node *.ts .
COPY --chown=node:node *.json .
COPY --chown=node:node *.yml .
COPY --chown=node:node ./src ./src

ENV NODE_ENV=production

RUN npm i -g npm@latest
RUN npm ci --omit=dev
RUN npm audit fix

FROM cgr.dev/chainguard/node:latest
# FROM gcr.io/distroless/nodejs

WORKDIR /app

COPY --chown=node:node --from=builder /usr/src/app .

USER node

EXPOSE 8080 3000

ENTRYPOINT ["npm", "start"]