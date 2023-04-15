# Build

FROM node:18

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Run

EXPOSE 3000

CMD node dist/main.js
