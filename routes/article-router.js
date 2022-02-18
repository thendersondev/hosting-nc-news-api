const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postComment,
} = require("../controllers/comments-controllers");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles);
articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);
articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articleRouter;
