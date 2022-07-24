FROM node:lts-alpine
# ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
COPY .env.example .env
EXPOSE ${PORT}
# RUN chown -R node /usr/src/app
# USER node
# RUN npx prisma generate
# RUN npx prisma migrate reset
CMD ["npm", "run", "start:dev"]