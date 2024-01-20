FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY bin/ ./bin
COPY public ./public
COPY routes ./routes
COPY models/ ./models
COPY app.js .

EXPOSE 4002

CMD npm start