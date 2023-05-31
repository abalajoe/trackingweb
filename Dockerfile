FROM node:14.15-alpine as node
WORKDIR /app
COPY  . .
RUN npm install
RUN npm run build --prod

FROM nginx:1.17.1-alpine
COPY --from=node /app/dist/trackingweb /usr/share/nginx/html
COPY --from=node /app/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/settings.template.json > /usr/share/nginx/html/assets/settings.json && exec nginx -g 'daemon off;'"]

