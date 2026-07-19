FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY services/shared ./services/shared
COPY services/portfolio-service/package*.json ./services/portfolio-service/
COPY prisma ./prisma

WORKDIR /app/services/portfolio-service
RUN npm install

COPY services/portfolio-service/ .

RUN npx prisma generate --schema=../../prisma/schema.prisma

EXPOSE 5002

CMD ["sh", "-c", "npx prisma db push --schema=../../prisma/schema.prisma && npm run dev"]
