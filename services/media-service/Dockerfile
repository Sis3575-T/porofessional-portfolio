FROM node:20-alpine

WORKDIR /app

COPY services/shared ./services/shared
COPY services/media-service/package*.json ./services/media-service/

WORKDIR /app/services/media-service
RUN npm install

COPY services/media-service/ .

EXPOSE 5003

CMD ["npm", "run", "dev"]
