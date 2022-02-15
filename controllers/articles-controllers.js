const {
  fetchArticle,
  updateArticleById,
  fetchAllArticles,
} = require("../models/articles-models");

exports.getArticles = async (req, res, next) => {
  try {
    const { rows: articles } = await fetchAllArticles();
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

    const [article] = await Promise.all([
      updateArticleById(id, number),
      fetchArticle(id), // will 404 if article not found
    ]); // will 400 if invalid inputs given

    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
