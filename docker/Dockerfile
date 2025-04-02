FROM node:18.10.0-alpine3.16 AS frontend-builder
WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm ci
COPY ./frontend ./
RUN npm run build

FROM node:18.10.0-alpine3.16 AS backend-builder

RUN apk add --no-cache curl bash \
  && curl -sf https://gobinaries.com/tj/node-prune | sh

WORKDIR /usr/src/app

COPY ./backend/package*.json ./
RUN npm ci
COPY ./backend .

RUN npm run db:gen \
  && npm run build \
  && npm prune --production \
  && node-prune

FROM node:18.10.0-alpine3.16

RUN apk add --no-cache jq

USER node:node
WORKDIR /usr/src/app

COPY --from=backend-builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=backend-builder --chown=node:node /usr/src/app/prisma ./prisma
COPY --from=backend-builder --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=backend-builder --chown=node:node /usr/src/app/package.json ./package.json
COPY --from=frontend-builder --chown=node:node /app/dist ./dist/public
COPY --chown=node:node ./docker/run-container.sh /usr/src/app/run-container.sh
COPY --chown=node:node ./docker/allowed_env_vars.json /usr/src/app/allowed_env_vars.json

CMD ["./run-container.sh"]
