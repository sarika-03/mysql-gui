# base image
FROM node:lts-stretch

WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm install
COPY . .

EXPOSE 5000

ENTRYPOINT ["sh", "/app/entrypoint.sh"]
