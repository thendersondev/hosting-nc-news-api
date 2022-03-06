const {
  fetchArticle,
  updateArticleById,
  fetchAllArticles,
  createArticle,
} = require("../models/articles-models");

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by: sort, order, topic, limit, p } = req.query;

    const { rows: articles } = await fetchAllArticles(
      sort,
      order,
      topic,
      limit,
      p
    );

    let total_count;
    articles.forEach((article, index) => {
      if (index === 0) total_count = article.total_count;
      delete article.total_count;
    });

    res.status(200).send({ articles, total_count });
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

exports.postArticle = async (req, res, next) => {
  try {
    const { body } = req;

    const { article_id: id } = await createArticle(body);
    const articleWithComments = await fetchArticle(id);

    res.status(201).send({ article: articleWithComments });
  } catch (err) {
    next(err);
  }
};
