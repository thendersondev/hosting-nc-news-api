const {
  fetchTopics,
  fetchArticle,
  updateArticleById,
} = require("../models/models");

exports.getTopics = async (req, res, next) => {
  try {
    const { rows: topics } = await fetchTopics();
    res.status(200).send(topics);
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id: id } = req.params;
    const { rows: article } = await fetchArticle(id);

    if (article.length === 1) {
      res.status(200).send(article[0]);
    } else {
      next({ status: 404, msg: "Article not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const { inc_votes: number } = req.body;
    const { article_id: id } = req.params;

    // check to see if article_id exists in db
    const { rows: article } = await fetchArticle(id);
    if (article.length === 1) {
      // if exists then patch
      await updateArticleById(id, number);
      res.status(204).send();
    } else {
      // otherwise throw 404
      next({ status: 404, msg: "Article not found" });
    }
  } catch (err) {
    next(err);
  }
};
