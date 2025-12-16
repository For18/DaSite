FROM node:24 AS build

WORKDIR /build

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install

COPY ./[^production.nginx.conf] .

RUN npx vite build --outDir ./dist


FROM nginx

COPY ./production.nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/dist/* /app