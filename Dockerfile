# FROM node:lts-alpine
FROM node:16.15-alpine
# ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install && mv node_modules ../
# RUN npm install --production --silent && mv node_modules ../
COPY . .
COPY .env.example .env
# EXPOSE ${PORT}
EXPOSE ${PORT}
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "start:dev"]

