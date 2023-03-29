# Justicket - API

<p align="center"><span>Powered by </span><a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="30" alt="Nest Logo" /></a></p>

## Configuration

### Environment variables

Environment variables can be put in a **.env** file at the root of the project. 

See the **.env.example** file as an example environment file

```bash
DB_HOST=localhost # Host of the database
DB_PORT=5432 # Port of the database
DB_USER=user # User of the database
DB_PASSWORD=pass # Password for the user above
DB_NAME=justicket # Name of the database/schema
DB_SYNC=true # Whether the database should be synced on app launch (Do not set to true in production)
```

## Installation

### Prerequisites

This project is written in Typescript, and should be run with Node v18+.

This project needs a Postgres database, which can be accessed thanks to the environment variables.

### Dependancies

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

### Build

```bash
$ docker build --tag justicket-back .
```

### Run

```bash
$ docker run --name justicket_back \
  -p 3000:3000 \
  -e DB_HOST=<database_host> \
  -e DB_USER=<database_user> \
  -e DB_PASSWORD=<database_password> \
  -e DB_NAME=<database_name> \
  -e DB_SYNC=<true | false> \
  -e PINATA_API_KEY=<pinata_api_key> \
  -e PINATA_SECRET_API_KEY=<pinata_secret_api_key> \
  -d justicket-back
```

## Contact us

- Developer - [Maxence Lequeux](mailto:maxence.lequeux.etu@univ-lille.fr)
- Developer - [Nicolas Henaff](mailto:nicolas.henaff.etu@univ-lille.fr)
- Developer - [Marc-Antoine Detourbe](mailto:marcantoine.detourbe.etu@univ-lille.fr)
- Developer - [Alexis Haine](mailto:alexis.haine.etu@univ-lille.fr)
- Developer - [Tarik Ainouch](mailto:tarik.ainouch.etu@univ-lille.fr)
