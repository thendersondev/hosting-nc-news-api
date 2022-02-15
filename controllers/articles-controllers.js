const {
  fetchArticle,
  updateArticleById,
} = require("../models/articles-models");

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

    const [{ rows: article }] = await Promise.all([
      updateArticleById(id, number),
      fetchArticle(id), // will 404 if article not found
    ]); // will 400 if invalid inputs given

    res.status(200).send({ article: article[0] });
  } catch (err) {
    next(err);
  }
};
