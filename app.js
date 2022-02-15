const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticleById,
  patchArticleById,
} = require("./controllers/articles-controllers");
const {
  trigger404,
  psqlErrors,
  customErrors,
  trigger500,
} = require("./controllers/error-controllers");
const { getUsers } = require("./controllers/users-controllers");

app.use(express.json());

// topics
app.get("/api/topics", getTopics);

// articles
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

//users
app.get("/api/users", getUsers);

// errors
app.all("/*", trigger404);
app.use(psqlErrors);
app.use(customErrors);
app.use(trigger500);

module.exports = app;
