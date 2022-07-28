# Home Library Service

This is the third part of the development of a Nestjs music library application. The app uses `prisma` to query the databased and can do the following:
- create and update the user
- create, update and delete a track, get a signle track by id and get all tracks
- create, update and delete an artist, get a single artist by id and get all artists
- create, update and delete an album, get a single album by id and get all albums
- add, update and delete a track, artist or album to/from the user's favorites
In this part we added `prisma` and deployed the database to docker
## The stack used
- Docker
- Prisma
- Postgresql
- Nestjs
- Typescript
- Eslint/Prettier
- Swagger
## Downloading, Installing and Running the App

- Clone the repository by running `git clone {repository URL}`
- On your local machine `cd` to the folder with the cloned repository
- Install all NPM dependencies by running `npm i` from the command line
- The application run on the local machine uses the `.env` as the environment file
- The application run in the docker uses the `.env.example` as the environment file, which is automatically copied into `.env` file upon setup

- To deploy the app and the database to docker, run `npm run docker:build`
- To run the tests in docker, run `npm run docker:test`
- To check the docker app for lint errors, run `npm run docker:lint`

Other commands you may find useful:
- Run `npm run docker:stop` to stop the containers
- Run `npm run docker:start` to start the containers
- Run `npm run docker:scan:app` to scan the application for vulnerabilities
- Run `npm run docker:scan:db` to scan the database for vulnerabilities
- To run application locally, with the database running in the docker, stop the music_app container in the docker and 
  run `npm run start:dev` or `npm run start` in the terminal

- The application is running on port 4000
- The postgres database is running on port 5432
- The variables are stores in the `.env` files


[![Docker images](https://raw.githubusercontent.com/mlatysheva/nodejs2022Q2-service/postgres_orm/screenshot_docker_test_and_lint.png)]

