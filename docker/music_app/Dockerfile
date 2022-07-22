FROM node:16.16-alpine3.16
# ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
COPY . .
COPY .env.example .env
EXPOSE ${PORT}
RUN chown -R node /usr/src/app
# RUN apk --no-cache add --virtual .builds-deps build-base python3
USER node
CMD ["npm", "run", "start:dev"]

