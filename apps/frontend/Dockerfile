FROM node:24

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install

COPY . .

CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]
EXPOSE 5173