# Use Node.js 8.17.0 as base image with Alpine Linux for a smaller footprint
FROM node:8.17.0-alpine

# Install Python 2 and other dependencies using Alpine package manager
RUN apk add --no-cache python2 make g++ 

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json ./
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación con las variables de entorno para producción
ARG AUTH_API_ADDRESS
ARG TODOS_API_ADDRESS
ARG ZIPKIN_URL
ENV AUTH_API_ADDRESS=${AUTH_API_ADDRESS}
ENV TODOS_API_ADDRESS=${TODOS_API_ADDRESS}
ENV ZIPKIN_URL=${ZIPKIN_URL}

# Construir la aplicación para producción
RUN npm run build

# Exponer el puerto configurado mediante variable de entorno
EXPOSE 8080

# Definir variables de entorno (valores por defecto que pueden ser sobreescritos)
ENV PORT=8080

# Comando para ejecutar la aplicación
CMD [ "npm", "start" ]