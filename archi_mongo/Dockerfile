FROM node:latest

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV DELETE_PSWD "delete"

CMD ["node", "server.js"]
