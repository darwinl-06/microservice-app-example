FROM openjdk:8-jdk-alpine

WORKDIR /app

COPY . .

RUN ./mvnw clean install

ENV JWT_SECRET=PRFT
ENV SERVER_PORT=8083

EXPOSE 8083

CMD ["java", "-jar", "target/users-api-0.0.1-SNAPSHOT.jar"]