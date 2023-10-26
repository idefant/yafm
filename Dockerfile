FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN GENERATE_SOURCEMAP=false npm run build


FROM nginx:1.21.0-alpine as production
WORKDIR /usr/share/nginx/html

RUN rm -rf *

COPY --from=builder /app/build .
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]