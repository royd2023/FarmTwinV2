# Backend Dockerfile
FROM node:18-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

ARG PORT
ARG NODE_ENV
ARG REDIS_URL
ARG FRONTEND_URL

ENV PORT=$PORT
ENV NODE_ENV=$NODE_ENV
ENV REDIS_URL=$REDIS_URL
ENV FRONTNED_URL=$FRONTEND_URL

# Build TypeScript
RUN npm install typescript ts-node @types/node --save-dev && \
    npm run build && \
    npm prune --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js", "--host", "0.0.0.0"]
