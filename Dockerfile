# Set the base image to Ubuntu
FROM        ubuntu

# Update the repository
RUN         apt-get update

# Install Redis Server
RUN         apt-get install -y redis-server

# Install wget
RUN         apt-get install -y wget

# Install Redis Server
RUN         wget -O - http://nodejs.org/dist/v0.10.29/node-v0.10.29-linux-x64.tar.gz \
  | tar xzf - --strip-components=1 --exclude="README.md" --exclude="LICENSE" \
  --exclude="ChangeLog" -C "/usr/local"

# Copy app to /src
COPY . /src

EXPOSE 8080

# Install app and dependencies into /src
RUN cd /src; npm install

# Run Server
CMD cd /src && node ./app.js