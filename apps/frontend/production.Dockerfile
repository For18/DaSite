FROM node:24 AS build

WORKDIR /build

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install

COPY . .

ARG VITE_API_URL
RUN VITE_API_URL="$VITE_API_URL" npx vite build --outDir ./dist


FROM nginx

COPY ./production.nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/dist /app