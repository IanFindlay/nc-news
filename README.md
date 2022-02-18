# News API

## Live Version

There is a live version of this app [hosted here](https://ncnewsian.herokuapp.com/api) via [Heroku](https://heroku.com) - please note that it is limited to GET requests and therefore lacks the full feature set of a locally hosted version.

## Summary Of The Project

This project is a demonstration of setting up a RESTful api. Written in JavaScript, using Express JS as a framework and PostgreSql as a database, it currently allows the user to interact with placeholder 'news' data in the following ways:

- GET a list of all of the available endpoints
- GET a list of topics covered by the articles
- GET a list of user that have posted comments to the articles
- GET a list of articles
- GET a specific article
- PATCH a specific article in order to vote on it
- GET all of the comments associated with a specific article
- POST a new comment to a specific article
- DELETE a specific comment
- PATCH a specific comment in order to vote on it
- GET a specific user

## Setup Instructions

### System setup

In order for a local copy of this api to run on your system there are a few things you need to have installed beyond the modules found in the package files:

- [Node](https://nodejs.org/en/) (version 17+)
- [npm](https://www.npmjs.com/) (version 8.1+)
- [PostgreSQL](https://www.postgresql.org/) (version 13.5+)

Versions earlier than those listed may work but have not been tested

### Cloning and installing modules

You can clone this repository via one of the three links shown in the 'Code' button dropdown near the top of this page - I'll show the HTTPS option as an example:

```
git clone https://github.com/IanFindlay/nc-news.git
```

Once cloned, navigate to the directory in you terminal and run the following command to install all of the applications dependencies - a list of which can be found in the package.json file:

```
npm i
```

### Environment setup

In order to create and connect to the databases locally you will need to make two environment files. These need to be created at the root of the repository and will set your PGDATABASE environment variable for the appropriate database:

- .env.development

```
PGDATABASE=nc_news
```

- .env.test

```
PGDATABASE=nc_news_test
```

Both of these files are already included in the .gitignore and will not be tracked.

### Creating and seeding the databases

Now run the following two commands - the first creates both the development and tests databases and the second seeds them with data

```
npm run setup-dbs
npm run seed
```

### Testing the application

Jest, a popular JavaScript testing framework, was installed as part of the installation step. To run the tests for the project, enter the following command:

```
npm t
```

### Using it

To start a locally hosted version of the app run the following command:

```
npm run start
```

This will open up a local port (9090 by default - this can be changed in the listen.js file) allowing you to make requests via a program like [Insomnia](https://insomnia.rest/download). A good first request would be `GET /api` which details all of the available endpoints.
