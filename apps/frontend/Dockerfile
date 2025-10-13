FROM node:24

WORKDIR /app

COPY . .
RUN npm install
RUN apt-get update && apt-get install -y curl

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD ["curl", "-f", "localhost:5173"]

CMD ["npx", "vite", "--host", "0.0.0.0"]
EXPOSE 5173