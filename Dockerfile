# ==========================================
# Dockerfile for ToyLand Self-Hosted App & DB
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package.json ./

# Install all dependencies
RUN npm install

# Copy application source code
COPY . .

# Build Vite frontend and compile Express server to dist/server.cjs
RUN npm run build

# ==========================================
# Production Runtime Stage
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built server, static assets, and package info
COPY package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Create persistent storage folder for local JSON database
RUN mkdir -p /app/data

# Persistent volume for database
VOLUME ["/app/data"]

EXPOSE 3000

# Run the unified web server and database
CMD ["node", "dist/server.cjs"]
