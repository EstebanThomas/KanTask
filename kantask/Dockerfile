# Étape 1 : Construire l'application
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Étape 2 : Image de production
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
