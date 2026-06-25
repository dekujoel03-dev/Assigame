FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

COPY mvnw pom.xml ./
COPY .mvn .mvn
COPY src src

RUN chmod +x mvnw && ./mvnw clean package -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/assigame-*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
