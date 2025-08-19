# Dockerfile (backend): Image de développement pour l'API Node.js (hot-reload, port 3000)

FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies early to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


