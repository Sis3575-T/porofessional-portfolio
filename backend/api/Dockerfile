FROM node:20-alpine
WORKDIR /app
COPY services/api/package*.json ./services/api/
WORKDIR /app/services/api
RUN npm install
COPY services/api/ .
EXPOSE 5000
CMD ["npm", "start"]