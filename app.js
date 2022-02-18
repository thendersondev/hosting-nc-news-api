const express = require("express");
const app = express();

// controller requiring
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("./controllers/articles-controllers");
const {
  trigger404,
  psqlErrors,
  customErrors,
  trigger500,
} = require("./controllers/error-controllers");
const { getUsers } = require("./controllers/users-controllers");
const {
  getCommentsByArticleId,
  postComment,
  deleteComment,
} = require("./controllers/comments-controllers");
const { getApi } = require("./controllers/api-controller");
// controller requiring

app.use(express.json());

// api
app.get("/api", getApi);

// topics
app.get("/api/topics", getTopics);

// articles
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

// users
app.get("/api/users", getUsers);

// comments
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);

// errors
app.all("/*", trigger404);
app.use(psqlErrors);
app.use(customErrors);
app.use(trigger500);

const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

module.exports = app;
