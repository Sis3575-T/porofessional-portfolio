FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache openssl

COPY prisma ./prisma

COPY services/shared ./services/shared
COPY services/backend/package*.json ./services/backend/
COPY services/auth-service/src ./services/auth-service/src
COPY services/portfolio-service/src ./services/portfolio-service/src
COPY services/media-service/src ./services/media-service/src
COPY services/dashboard-service/src ./services/dashboard-service/src

WORKDIR /app/services/shared
RUN npm install

WORKDIR /app/services/backend
RUN npm install

COPY services/backend/ .

RUN npx prisma generate --schema=../../prisma/schema.prisma

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push --schema=../../prisma/schema.prisma && node src/server.js"]
