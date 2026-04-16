FROM openjdk:17-jdk-slim

WORKDIR /app

COPY . .

WORKDIR /app/backend

RUN mvn clean package -DskipTests

CMD ["java", "-jar", "target/*.jar"]