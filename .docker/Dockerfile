FROM node:18.16-alpine3.16 as builder

# Setup Operator
WORKDIR /app
COPY . .
RUN npm install --production && \
    npm install -g @vercel/ncc && \
    ncc build src/main.ts -o dist

FROM node:18.16-alpine3.16

ARG JAVA_VERSION

# Install AdoptiumJRE & Pterodactyl Image Requirements
RUN wget -O /etc/apk/keys/adoptium.rsa.pub https://packages.adoptium.net/artifactory/api/security/keypair/public/repositories/apk && \ 
    echo 'https://packages.adoptium.net/artifactory/apk/alpine/main' >> /etc/apk/repositories && \ 
    apk add temurin-$JAVA_VERSION-jre curl openssl git tar bash sqlite fontconfig

# Setup User
RUN adduser --disabled-password --home /home/container container
ENV USER=container HOME=/home/container

WORKDIR /opt/server
COPY --from=builder /app/dist/index.js .

CMD ["node", "index.js"]

