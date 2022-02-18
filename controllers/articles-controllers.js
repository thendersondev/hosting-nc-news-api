const {
  fetchArticle,
  updateArticleById,
  fetchAllArticles,
} = require("../models/articles-models");

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by: sort, order, topic } = req.query;

    const { rows: articles } = await fetchAllArticles(sort, order, topic);

    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id: id } = req.params;

    const article = await fetchArticle(id);

    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  try {
    const { inc_votes: number } = req.body;
    const { article_id: id } = req.params;

    const article = await updateArticleById(id, number);

    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
