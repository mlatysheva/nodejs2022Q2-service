FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
COPY prisma ./prisma
RUN npm install
COPY . .
COPY .env.example .env
RUN npm run build
EXPOSE ${PORT}
CMD ["npm", "run", "start:migrate:prod"]