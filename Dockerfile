FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY backend/target/*.jar app.jar

CMD ["java", "-jar", "app.jar"]