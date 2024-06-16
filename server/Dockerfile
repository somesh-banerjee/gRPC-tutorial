FROM node:20.04

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 50055

CMD ["node", "server.js"]