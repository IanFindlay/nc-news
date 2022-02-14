# News API

## Environment Setup

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
