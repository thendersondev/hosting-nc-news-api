const { fetchTopics, fetchArticle } = require("../models/models");
const { trigger404 } = require("./error-controllers");

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
      next({ status: 400, msg: "Article not found" });
    }
  } catch (err) {
    next(err);
  }
};
