FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/*.jar app.jar
ENV PORT 8080
EXPOSE $PORT
CMD ["sh", "-c", "java -jar app.jar --server.port=$PORT"]
