FROM gitpod/workspace-full:latest

# Install Java 17
RUN bash -c ". /home/gitpod/.sdkman/bin/sdkman-init.sh && \
    sdk install java 17.0.7-ms && \
    sdk default java 17.0.7-ms"

# Install MySQL
RUN sudo apt-get update && \
    sudo apt-get install -y mysql-server && \
    sudo service mysql start && \
    sudo mysqladmin -u root password 'root'

# Set environment variables
ENV JAVA_HOME=/home/gitpod/.sdkman/candidates/java/current
ENV PATH=$JAVA_HOME/bin:$PATH

# Install Node.js 18 (if not already present)
RUN bash -c ". /home/gitpod/.nvm/nvm.sh && \
    nvm install 18 && \
    nvm use 18 && \
    nvm alias default 18"

# Pre-install common Maven dependencies
RUN mkdir -p /tmp/maven-deps
COPY backend/pom.xml /tmp/maven-deps/
RUN cd /tmp/maven-deps && \
    mvn dependency:go-offline -B && \
    rm -rf /tmp/maven-deps
