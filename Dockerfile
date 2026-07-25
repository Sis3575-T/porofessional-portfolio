FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
COPY services/shared/package*.json ./services/shared/
COPY services/backend/package*.json ./services/backend/
COPY services/auth-service/package*.json ./services/auth-service/
COPY services/portfolio-service/package*.json ./services/portfolio-service/
COPY services/media-service/package*.json ./services/media-service/
COPY services/dashboard-service/package*.json ./services/dashboard-service/

RUN npm install
RUN cd services/shared && npm install && cd ../..
RUN cd services/backend && npm install && cd ../..
RUN cd services/auth-service && npm install && cd ../..
RUN cd services/portfolio-service && npm install && cd ../..
RUN cd services/media-service && npm install && cd ../..
RUN cd services/dashboard-service && npm install && cd ../..

COPY services/shared ./services/shared
COPY services/backend ./services/backend
COPY services/auth-service ./services/auth-service
COPY services/portfolio-service ./services/portfolio-service
COPY services/media-service ./services/media-service
COPY services/dashboard-service ./services/dashboard-service

WORKDIR /app/services/backend
RUN npx prisma generate --schema=../../prisma/schema.prisma

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push --schema=../../prisma/schema.prisma && node src/server.js"]
