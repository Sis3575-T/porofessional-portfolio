FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY services/shared ./services/shared
COPY services/auth-service/package*.json ./services/auth-service/
COPY prisma ./prisma

WORKDIR /app/services/auth-service
RUN npm install

COPY services/auth-service/ .

RUN npx prisma generate --schema=../../prisma/schema.prisma

EXPOSE 5001

CMD ["sh", "-c", "npx prisma db push --schema=../../prisma/schema.prisma && npm run dev"]
