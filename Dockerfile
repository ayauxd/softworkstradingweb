FROM node:18-slim AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including dev dependencies for build
RUN npm ci

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-slim AS production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --production

# Copy built application from build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/server/render-server.js /app/dist/server/

# Add metadata
LABEL org.opencontainers.image.title="Softworks Trading Company"
LABEL org.opencontainers.image.description="React application with Express backend"
LABEL org.opencontainers.image.vendor="Softworks Trading Company"

# Expose the application port
EXPOSE 8080

# Use non-root user for better security
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Run the application
CMD ["node", "dist/server/render-server.js"]