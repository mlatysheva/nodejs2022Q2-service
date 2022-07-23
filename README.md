# Home Library Service

This is the second part of the development of a Nestjs RESTful music library application that can do the following:
- create and update the user
- create, update and delete a track, get a signle track by id and get all tracks
- create, update and delete an artist, get a single artist by id and get all artists
- create, update and delete an album, get a single album by id and get all albums
- add, update and delete a track, artist or album to/from the user's favorites
In this part we added docker where we deployed the app and the database that will be used to store the information
## The stack used
- Docker
- Postgresql
- Nestjs
- Typescript
- Eslint/Prettier
- Swagger
## Downloading, Installing and Running the App

- Clone the repository by running `git clone {repository URL}`
- On your local machine `cd` to the folder with the cloned repository
- Install all NPM dependencies by running `npm i` from the command line
- Rename the file `.env.example` into `.env`

- To deploy the app and the database to docker, run `npm run docker:build`
- Run `npm run docker:stop` to stop the containers
- Run `npm run docker:start` to start the containers
- Run `npm run docker:scan:app` to scan the application for vulnerabilities
- Run `npm run docker:scan:db` to scan the database for vulnerabilities

- The application is running on port 4000
- The postgres database is running on port 5432

[![Docker images](https://raw.githubusercontent.com/mlatysheva/nodejs2022Q2-service/containerization-docker/screenshot_images_sizes.png)]

- The image of the application is 375 Mb
- There is a `user-defined bridge`
- The app container restarts after crashing
- The built image has been pushed to [![Doker Hub](https://hub.docker.com/repository/docker/mlatysheva/music_app)]
