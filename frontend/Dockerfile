# ---- Build Stage ----
FROM node:8-alpine AS build-stage

WORKDIR /app

# Install Python 2 and build tools needed by node-gyp (for node-sass)
RUN apk add --no-cache python2 make g++

# Set npm config to avoid node-gyp issues
ENV SASS_BINARY_SITE=https://github.com/sass/node-sass/releases/download
ENV NODE_OPTIONS=--max_old_space_size=4096

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --unsafe-perm

# Copy source and build
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM nginx:stable-alpine AS production-stage

# Instalar gettext para envsubst (sustitución de variables)
RUN apk add --no-cache gettext

# Copiar los archivos compilados al directorio de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar la configuración de nginx como template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Configurar variables de entorno para la integración con API Management
ENV API_GATEWAY_URL="apim-yb6znq.azure-api.net"
ENV APIM_SUBSCRIPTION_KEY="9e4cb027af834c0e88f7a83bd51927df"

# Exponer el puerto 8080 para Container Apps
EXPOSE 8080

# Comando para iniciar el contenedor: 
# 1. Sustituir variables en el template
# 2. Iniciar Nginx
CMD ["/bin/sh", "-c", "envsubst '${API_GATEWAY_URL} ${APIM_SUBSCRIPTION_KEY}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]