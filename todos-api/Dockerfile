FROM node:8.17.0

WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Configurar variables de entorno con valores predeterminados para Azure Container
ENV TODO_API_PORT=8082
ENV JWT_SECRET=PRFT
ENV REDIS_HOST=
ENV REDIS_PORT=6379
ENV REDIS_CHANNEL="log_channel"

# Exponer el puerto configurado
EXPOSE $TODO_API_PORT

# Comando para iniciar la aplicación
CMD ["node", "server.js"]