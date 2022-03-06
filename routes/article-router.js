const {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticle,
  deleteArticle,
} = require("../controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postComment,
} = require("../controllers/comments-controllers");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticle);
articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticle);
articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articleRouter;
