FROM node:18.10.0-alpine3.16 AS frontend-builder
WORKDIR /app

ARG VITE_EXRATES_API
ARG VITE_AUTHORITY
ARG VITE_CLIENT_ID
ARG VITE_ACCOUNT_URL

ENV VITE_EXRATES_API=$VITE_EXRATES_API
ENV VITE_AUTHORITY=$VITE_AUTHORITY
ENV VITE_CLIENT_ID=$VITE_CLIENT_ID
ENV VITE_ACCOUNT_URL=$VITE_ACCOUNT_URL

COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./
RUN npm run build

FROM node:18.10.0-alpine3.16 AS backend-builder

RUN apk update \
  && apk add curl bash \
  && rm -rf /var/cache/apk/* \
  && curl -sf https://gobinaries.com/tj/node-prune | sh

WORKDIR /usr/src/app

COPY ./backend/package*.json ./
RUN npm ci
COPY ./backend .

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

RUN npm run db:gen \
  && npm run db:push \
  && npm run build \
  && npm prune --production \
  && node-prune /usr/src/app/node_modules

FROM node:18.10.0-alpine3.16
USER node:node
WORKDIR /usr/src/app

COPY --from=backend-builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=backend-builder --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=backend-builder --chown=node:node /usr/src/app/package.json ./package.json
COPY --from=frontend-builder --chown=node:node /app/dist ./dist/public

CMD [ "npm", "run", "serve" ]
