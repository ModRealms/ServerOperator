FROM node:16-bullseye-slim as install

# Setup Operator
WORKDIR /opt/server
COPY package*.json .
RUN npm install

FROM install as build

WORKDIR /opt/server
COPY --from=install /opt/server/node_modules ./node_modules
COPY --from=install /opt/server/package*.json .
COPY tsconfig.json .
COPY src ./src
RUN npm run build

FROM node:16-bullseye-slim as java

ARG JAVA_VERSION

# Install AdoptiumJDK
RUN apt-get update && apt-get install -y wget apt-transport-https gnupg \
    && wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | apt-key add - \
    && echo "deb https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list \
    && apt-get update && apt-get install -y temurin-$JAVA_VERSION-jdk

# Setup Pterodactyl Image Requirements
RUN apt-get update && apt-get install -y curl ca-certificates openssl git tar bash sqlite3 fontconfig

# Setup User
RUN adduser --disabled-password --home /home/container container

FROM java as run

ENV USER=container HOME=/home/container

WORKDIR /opt/server
COPY --from=install /opt/server/node_modules ./node_modules
COPY --from=install /opt/server/package*.json .
COPY --from=build /opt/server/dist ./dist

CMD ["node", "dist/index.js"]