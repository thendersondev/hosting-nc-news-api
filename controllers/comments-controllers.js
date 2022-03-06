const {
  fetchCommentsByArticleId,
  makeComment,
  cancelComment,
  updateComment,
} = require("../models/comments-models");

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id: id } = req.params;
    const { limit, p } = req.query;

    const comments = await fetchCommentsByArticleId(id, limit, p);

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

    await cancelComment(id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.patchComment = async (req, res, next) => {
  try {
    const { comment_id: id } = req.params;
    const { inc_votes: inc } = req.body;

    const comment = await updateComment(id, inc);

    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};
