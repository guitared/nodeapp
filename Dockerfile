FROM keymetrics/pm2:latest-alpine

EXPOSE 8080
ENV NPM_CONFIG_LOGLEVEL warn
CMD [ "pm2-runtime", "start", "pm2.json", "-i", "max" ]

COPY pm2.json .
COPY package.json .
RUN npm install --production

COPY src src/