const { fetchArticle } = require("../models/articles-models");
const {
  fetchCommentsByArticleId,
  makeComment,
} = require("../models/comments-models");
const { fetchUser } = require("../models/users-models");

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id: id } = req.params;

    const [{ rows: comments }] = await Promise.all([
      fetchCommentsByArticleId(id),
      fetchArticle(id), // will 404 if article not found
    ]);

    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  try {
    const { article_id: id } = req.params;
    const { username, body } = req.body;

    // check if article exists, if not throw 404
    // check if username exists, if not throw 400
    await Promise.all([fetchArticle(id), fetchUser(username)]);
    // Promise.all with makeComment doesn't work here
    // makeComment has a chance of throwing a 400 "violates foreign key constraint" first

    const {
      rows: [comment],
    } = await makeComment(id, username, body);

    res.status(201).send(comment);
  } catch (err) {
    next(err);
  }
};
