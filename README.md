# Northcoders News API

## Hosted api: https://toms-nc-news-api.herokuapp.com/api

<br>

## Summary:

This project is my first attempt at creating and hosting an API using heroku <br>
<br>

## It's free real estate

Feel free to fork and/or clone this repo. All dependencies can be installed with npm install. There are several scripts available which can be found in the package.json. Before doing anything you should run the following scripts to initialise and seed the SQL database: <br>

- npm run setup-dbs
- npm run seed-test
- npm run seed

You should also create the following files in the root directory: <br>
.env.test (contents: PGDATABASE=nc_news_test) <br>
.env.development (contents: PGDATABASE=nc_news) <br>

The minimum versions of Node.js and postgres which I can endorse for running the project are:

- Node v17.2.0
- psql v12.9
