# syntax=docker/dockerfile:1

ARG node_version=latest
ARG angular_cli_version=12.1.3

FROM node:$node_version

# Change to working directory
WORKDIR /city-web-map

# Install all dependencies
COPY package*.json ./
RUN npm install -g @angular/cli@$node_version

RUN npm install
# RUN npm ci --only=production

# Copy sources
COPY . .

# Prepare for publishing
EXPOSE 4200

# This will be executed while running the container
CMD [ "ng", "serve", "--host", "0.0.0.0" ]
