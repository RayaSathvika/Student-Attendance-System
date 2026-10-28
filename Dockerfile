FROM node:24-trixie

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm install

COPY backend/server.js ./

EXPOSE 5000

CMD ["node", "server.js"]