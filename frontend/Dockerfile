# ---- Build Stage ----
FROM node:14-alpine AS build-stage

WORKDIR /app

# Install Python 3 and build tools needed by node-gyp
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM nginx:stable-alpine AS production-stage

# Copy the built app
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration directly to default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
