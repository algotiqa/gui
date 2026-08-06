# ====================================================================
# === Stage 1: Build the frontend
# ====================================================================

FROM node:24-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files and build
COPY . .
RUN npm run build -- --configuration=production

# ====================================================================
# === Stage 2: Serve with Nginx
# ====================================================================

FROM nginx:alpine
# Override stock config with SPA fallback routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy compiled static files to Nginx web root directory
COPY --from=build /app/dist/gui/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
