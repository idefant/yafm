FROM node:18.8.0-alpine3.15 AS build
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install
COPY ./ /app
RUN npm run build

FROM nginx:1.21.0-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]