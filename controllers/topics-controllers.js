const { fetchTopics, createTopic } = require("../models/topics-models");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.postTopic = async (req, res, next) => {
  try {
    const { body } = req;

    const topic = await createTopic(body);

    res.status(201).send({ topic });
  } catch (err) {
    next(err);
  }
};
