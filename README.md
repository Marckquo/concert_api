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
HTTP_PORT=3000 # Port to launch the server on
PINATA_API_KEY=08df48d3077bbc35fcbc # Public Pinata key
PINATA_SECRET_API_KEY=8517409ccd0bec03944706701d4ed721c96a2ab81411840d571c1ace6c7d1d42 # Private Pinata key
RPC_ADDRESS=https://ghostnet.tezos.marigold.dev/ # Address of the RPC node
TEZOS_PRIVATE_KEY=edskRzGcE7iqmj9JFuaTUzDZeQDY3SuNb4XhLfeAXq3UaYX4sSG7jDBbSdLkSRWfwC7MqHZwXShn1GwH6wk7kKTZRHMbdMaiJs # Tezos private key of the system
CONTRACT_ADDRESS=KT1JXEthzfrNSS4jfjdYbyp9WM5mYbBcZbVC # Justicket contract address
CREATION_PRICE_TEZ=2 # Price to pay in TEZ at when creating a show (>1 TEZ)
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

*See the .env.example file*

```bash
$ docker run --name justicket_back \
  -p 3000:3000 \
  -e DB_HOST=<database_host> \
  -e DB_USER=<database_user> \
  -e DB_PASSWORD=<database_password> \
  -e DB_NAME=<database_name> \
  -e DB_SYNC=<true | false> \
  -e HTTP_PORT=3000
  -e PINATA_API_KEY=<pinata_api_key> \
  -e PINATA_SECRET_API_KEY=<pinata_secret_api_key> \
  -e RPC_ADDRESS=<rpc_address> \
  -e TEZOS_PRIVATE_KEY=<tezos_system_private_key> \
  -e CONTRACT_ADDRESS=<justicket_contract_address> \
  -e CREATION_PRICE_TEZ=<creation_price_in_tez> \
  -d justicket-back
```

## Documentation

### Bearer tokens

Each priviledged request (admin request) must have a bearer token of this format

```<tezos_public_key>.<wallet_address>.<signature>```

where ```<signature>``` is the wallet_address signed with the Tezos private key.

Authorization header example :

```Authorization: Bearer edpkttWmknwVJ7MxgMZC2Fs4ERyJ2rkbcB69qhqbDif3TFegGzGQRD.tz1ZZGh8QWtXA5gc465GxafcwK9Gdg5PaWgf.sigj47SD7ZiA6tLbaxKREgWDpfwoqxM3W4yMeRJGUxwbJCi4AG5jHs4JUA9YDpBvuwNTZ1y9Yoh6m88jp6ENTz4sThsFrcTz```

### Websocket

The application provides a websocket that broadcasts the results of the show creation operations on Tezos.

Each result has this structure

```json
{
  "event": "result",
  "data": {
    "showId": string,
    "address": string | null
  }
}
```

where ```showId``` reprensents the id of the show the result is for, and ```address``` is the address of the show on Tezos, or ```null``` if it failed.

Naive websockets are used here, which means the client can connect to this websocket with the Websocket API, on the same port than the running app.

## Contact us

- Developer - [Maxence Lequeux](mailto:maxence.lequeux.etu@univ-lille.fr)
- Developer - [Nicolas Henaff](mailto:nicolas.henaff.etu@univ-lille.fr)
- Developer - [Marc-Antoine Detourbe](mailto:marcantoine.detourbe.etu@univ-lille.fr)
- Developer - [Alexis Haine](mailto:alexis.haine.etu@univ-lille.fr)
- Developer - [Tarik Ainouch](mailto:tarik.ainouch.etu@univ-lille.fr)
