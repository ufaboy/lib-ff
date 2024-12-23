# Development
FROM node:20-alpine as dev-stage
WORKDIR /app
COPY package*.json ./
RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*
RUN npm install
RUN npx prisma generate
USER root
RUN apk add --no-cache mc mysql-client
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production
FROM node:20-alpine as prod-stage
WORKDIR /app
# COPY --from=dev-stage /app /app
COPY package*.json ./
RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*
RUN npm install
COPY . .
COPY .env .env
RUN npx prisma generate
USER root
RUN apk add --no-cache mc mysql-client
EXPOSE 3000
CMD ["npm", "run", "start"]