const express = require("express");
const app = express();

const { getTopics } = require("./controllers/controllers");
const { trigger404 } = require("./controllers/error-controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("/*", trigger404);

module.exports = app;
