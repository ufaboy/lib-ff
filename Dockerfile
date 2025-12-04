# Development
FROM node:24-alpine as dev-stage
WORKDIR /app
COPY package*.json ./
RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
USER root
RUN apk add --no-cache mc mysql-client
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production
FROM node:24-alpine as prod-stage
WORKDIR /app
COPY package*.json ./
RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*
RUN npm install --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
USER root
RUN apk add --no-cache mc mysql-client
EXPOSE 3000
CMD ["npm", "run", "start"]