const { getTopics } = require("../controllers/topics-controllers");

const topicRouter = require("express").Router();

topicRouter.route("/").get(getTopics);

module.exports = topicRouter;
