FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn package -Dmaven.test.skip=true -B
RUN find target/ -name "*.jar" -not -name "*plain.jar" -exec cp {} target/app.jar \;

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /build/target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]