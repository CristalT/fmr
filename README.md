# Installation in local environments

## Requirements

Install NVM and choose the proper Node version

```bash
nvm install
nvm use
```

Install PNPM package manager

```bash
npm corepack enable pnpm
```

## Install dependecies

```bash
pnpm i
```

 ## Configure envioronment variables

 Copy the `env.example` file to `.env` and complete the values.

 ## Up the containers

```bash
docker compose up -d
```

## Run migrations

```bash
node ace migration:run
```

## Run database seeders

```bash
node ace db:seed
```

## Create an admin user

```bash
node ace user:create
```

## Create the uploads folder

```bash
mkdir -p uploads/images
```

## Run local server

```bash
pnpm dev
```

