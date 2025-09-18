FROM maven:3.9-eclipse-temurin-21 as build

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY wait-for-mysql.sh .

# Install netcat for health check
RUN apt-get update && apt-get install -y netcat-openbsd && chmod +x wait-for-mysql.sh

EXPOSE 8080

ENTRYPOINT ["./wait-for-mysql.sh"]