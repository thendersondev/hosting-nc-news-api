const express = require("express");
const app = express();

const { getTopics, getArticleById } = require("./controllers/controllers");
const {
  trigger404,
  psqlErrors,
  customErrors,
} = require("./controllers/error-controllers");

app.use(express.json());

// topics
app.get("/api/topics", getTopics);

// articles
app.get("/api/articles/:article_id", getArticleById);

// errors
app.all("/*", trigger404);
app.use(psqlErrors);
app.use(customErrors);

module.exports = app;
