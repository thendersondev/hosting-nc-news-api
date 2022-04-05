# Northcoders News API

Northcoders News API is a RESTful api which has been created using Node.js, Express.js, PSQL.
The database has been deployed through Heroku, you can visit the API [here](https://toms-nc-news-api.herokuapp.com/api).

## Summary

This project is my first attempt at creating and hosting an API using heroku. The API and all of its endpoints were created using test driven development with Jest and Supertest.

Feel free to fork and/or clone this repo. All dependencies can be installed with npm install. There are several scripts available which can be found in the package.json. Before doing anything you should create the following files in the root directory:

`.env.test (contents: PGDATABASE=nc_news_test)`

`.env.development (contents: PGDATABASE=nc_news)`

Following this you can run the following scripts to seed the SQL database:

```
npm run setup-dbs
npm run seed
```

Once the above is done you can run the tests using:

```
npm test
```

The minimum versions of Node.js and postgres which I can endorse for running the project are:

- Node v17.2.0
- psql v12.9

## Built With

- [Express](https://expressjs.com/) - Web framework for Node.js
- [PSQL](https://www.postgresql.org/) - Open source relational database
- [JEST](https://jestjs.io/) - JavaScript testing framework
- [Supertest](https://www.npmjs.com/package/supertest) - HTTP testing framework
