# ----- Stage 1: Build Stage -----
# Use the official OpenJDK 17 'jdk' image as a builder
FROM eclipse-temurin:17-jdk-focal AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml
# This caches these layers, so dependencies are only re-downloaded if pom.xml changes
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies (optional, but speeds up subsequent builds)
# RUN ./mvnw dependency:go-offline

# Copy the rest of the source code 
COPY src ./src

# --- FIX: Add execute permission to the Maven wrapper ---
RUN chmod +x mvnw

# Build the application, creating the executable JAR
# We skip tests to make the build faster
RUN ./mvnw package -DskipTests

# ----- Stage 2: Final Stage -----
# Use the lightweight OpenJDK 17 'jre' image to run the app
FROM eclipse-temurin:17-jre-focal

# Set the working directory
WORKDIR /app

# Copy the executable JAR from the 'builder' stage
# This finds the JAR in the /app/target/ directory and renames it to app.jar
COPY --from=builder /app/target/*.jar app.jar

# Expose the port the app will run on.
# Render will automatically use this.
EXPOSE 8080

# The command to run your application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]