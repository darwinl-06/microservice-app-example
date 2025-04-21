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

# Construir la aplicación
RUN npm run build

# Exponer el puerto configurado mediante variable de entorno
EXPOSE 8080

# Definir variables de entorno (valores por defecto que pueden ser sobreescritos)
ENV PORT=8080 \
    AUTH_API_ADDRESS=http://auth-api:8000 \
    TODOS_API_ADDRESS=http://todos-api:8082

# Comando para ejecutar la aplicación
CMD [ "npm", "start" ]