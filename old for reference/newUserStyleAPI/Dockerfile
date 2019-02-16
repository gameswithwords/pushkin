FROM node:latest
RUN apt-get update && apt-get install -y netcat
COPY ./dockerSource/build /usr/src/app
COPY ./dockerSource/package.json /usr/src/app
COPY ./dockerSource/dockerStart.sh /usr/src/app
WORKDIR /usr/src/app
RUN npm install --production

# Note that this is overridden in docker compose
CMD ["node", "index.js"]
