FROM node:10-alpine

EXPOSE 8080

CMD [ "npm", "start" ]

COPY package.json .
RUN npm install --production

COPY src src/