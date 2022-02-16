const { fetchArticle } = require("../models/articles-models");
const { fetchCommentsByArticleId } = require("../models/comments-models");

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id: id } = req.params;

    const [{ rows: comments }] = await Promise.all([
      fetchCommentsByArticleId(id),
      fetchArticle(id),
    ]);

    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
