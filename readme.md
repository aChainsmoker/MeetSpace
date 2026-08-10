# Setup

## Clone Repository
```
git clone https://github.com/aChainsmoker/MeetSpace.git
cd MeetSpace/
```

## Enter enviromental variables

Create `.env` files and write variables into them according to `.env_examples` files.

For example:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

DB_NAME=MeetSpaceDb

MINIO_USER=Admin
MINIO_PASSWORD=password
```
Each service contains its own `.env` file, make sure to go through all of them.

You can go with just copypasting contents of `.env_example` files into `.env` files - It will work, just won't be secure.

## Launch the App

```
docker compose up --build -d
```

### You can access the app at [localhost:3000](http://localhost:3000)

## Premade Manager

You can access premade manager user using credentials:
```
email: manager@manager.com
password: manager
```
*(these credentials work in the deployed version as well)*
