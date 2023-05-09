FROM node:18.12-alpine3.17

RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app
COPY --chown=app:node package*.json ./
RUN npm install
COPY --chown=app:node . .

EXPOSE 5000

CMD ["npm", "start"]