FROM node:carbon-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --only=production

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
