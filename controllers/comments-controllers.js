const {
  fetchCommentsByArticleId,
  makeComment,
  cancelComment,
} = require("../models/comments-models");

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id: id } = req.params;

    const comments = await fetchCommentsByArticleId(id);

    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  try {
    const { article_id: id } = req.params;
    const { username, body } = req.body;

    const [comment] = await makeComment(id, username, body);

    res.status(201).send(comment);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { comment_id: id } = req.params;

    const cancelledComment = await cancelComment(id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
