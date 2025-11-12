# Use official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jre

# Set the working directory inside the container
WORKDIR /app

# Copy built jar to /app/app.jar
COPY target/*.jar app.jar

# Render sets the PORT env variable. Make Spring Boot respect PORT.
# Use JAVA_OPTS for extra config if needed.
ENV PORT 8080

# Expose the port
EXPOSE $PORT

# Entrypoint to run the Spring Boot app, use $PORT variable.
CMD ["sh", "-c", "java -jar app.jar --server.port=$PORT"]
