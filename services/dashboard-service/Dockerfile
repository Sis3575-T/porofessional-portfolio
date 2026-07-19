FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY services/shared ./services/shared
COPY services/dashboard-service/package*.json ./services/dashboard-service/
COPY prisma ./prisma

WORKDIR /app/services/dashboard-service
RUN npm install

COPY services/dashboard-service/ .

RUN npx prisma generate --schema=../../prisma/schema.prisma

EXPOSE 5004

CMD ["sh", "-c", "npx prisma db push --schema=../../prisma/schema.prisma && npm run dev"]
