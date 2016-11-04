# Set the base image to Ubuntu
FROM        ubuntu:latest

# Update the repository
RUN         apt-get update

# Install Redis Server
RUN         apt-get install -y redis-server

# Install wget
RUN         apt-get install -y wget

# Install Nodejs
RUN         wget -O - http://nodejs.org/dist/v0.10.29/node-v0.10.29-linux-x64.tar.gz \
  | tar xzf - --strip-components=1 --exclude="README.md" --exclude="LICENSE" \
  --exclude="ChangeLog" -C "/usr/local"

# Install npm
RUN         apt-get install -y npm

# Copy app to /src
COPY . /src

# Expose port
EXPOSE 3000

# Call the init script
CMD chmod 777 /src/init.sh

# Call the init script
CMD /src/init.sh
