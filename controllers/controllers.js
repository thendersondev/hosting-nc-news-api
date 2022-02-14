const { fetchTopics } = require("../models/models");

exports.getTopics = async (req, res, next) => {
  try {
    const { rows: topics } = await fetchTopics();
    res.status(200).send(topics);
  } catch (err) {
    next(err);
  }
};
