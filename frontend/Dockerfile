# ---- Build Stage ----
    FROM node:8-alpine AS build-stage

    WORKDIR /app
    
    # Install Python 2 and build tools needed by node-gyp (for node-sass)
    RUN apk add --no-cache python2 make g++
    
    COPY package*.json ./
    RUN npm install
    COPY . .
    RUN npm run build
    
    # ---- Production Stage ----
    FROM nginx:stable-alpine AS production-stage
    
    # Instalamos gettext para usar envsubst
    RUN apk add --no-cache gettext
    
    # Copiamos la app construida
    COPY --from=build-stage /app/dist /usr/share/nginx/html
    
    # Copiamos el nginx.conf como plantilla (no lo sobrescribimos directo)
    COPY nginx.conf /etc/nginx/templates/default.conf.template
    
    # Exponemos el puerto
    EXPOSE 8080
    
    # Al iniciar el contenedor, reemplazamos variables de entorno
    CMD ["/bin/sh", "-c", "envsubst '${API_GATEWAY_FQDN}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
    