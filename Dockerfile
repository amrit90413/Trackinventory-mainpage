# 1. Build Stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source
COPY . .

# Build production-ready static files
RUN npm run build

# 2. Serve Stage (Nginx)
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy built Vite dist output from build stage
COPY --from=build /app/dist .

# Copy a default nginx config (optional: for SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
