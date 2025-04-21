# Use Node.js 8.17.0 as base image (según la versión indicada en README)
FROM node:8.17.0

# Install Python 2
RUN apt-get update && apt-get install -y \
    python2.7 \
    python2.7-dev \
    python-pip \
    && ln -s /usr/bin/python2.7 /usr/bin/python \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

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