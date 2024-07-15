# Stage 1: Build the Angular application
FROM node:18 AS build

WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install -g @angular/cli

RUN npm install

# Copy source files and build the application
CMD ["ng", "serve", "--host", "0.0.0.0"]
