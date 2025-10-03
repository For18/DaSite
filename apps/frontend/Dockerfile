FROM node:24

WORKDIR /app

COPY . .
RUN npm install

CMD npx vite --host 0.0.0.0
EXPOSE 5170