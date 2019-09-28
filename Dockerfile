FROM keymetrics/pm2:latest-alpine

EXPOSE 3000
ENV NPM_CONFIG_LOGLEVEL warn
CMD [ "pm2-runtime", "start", "pm2.json" ]

COPY pm2.json .
COPY package.json .
RUN npm install --production

COPY src src/