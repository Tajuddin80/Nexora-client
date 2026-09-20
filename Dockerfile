# ==========================================
# Stage 1: Build React 19 + Vite Frontend
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies using clean install for reproducible builds
COPY package.json package-lock.json ./
RUN npm ci --silent

# Build arguments for Vite environment variables
ARG VITE_SERVER_URL=http://localhost:5000
ARG VITE_PAYMENT_PUBLISH_KEY=""
ARG VITE_CLOUDINARY_CLOUD_NAME=""
ARG VITE_CLOUDINARY_API_KEY=""

# Pass arguments to environment for Vite bundling
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_PAYMENT_PUBLISH_KEY=$VITE_PAYMENT_PUBLISH_KEY
ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME
ENV VITE_CLOUDINARY_API_KEY=$VITE_CLOUDINARY_API_KEY

# Copy application source files
COPY . .

# Build the production distribution bundle
RUN npm run build

# ==========================================
# Stage 2: Serve Static Assets with Nginx
# ==========================================
FROM nginx:1.27-alpine AS runner

# Remove default Nginx virtual host configuration
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration optimized for React SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Health check to monitor container health
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
