const { getApi } = require("../controllers/api-controller");
const apiRouter = require("express").Router();
const topicRouter = require("./topic-router");
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");
const userRouter = require("./user-router");
const { trigger404 } = require("../controllers/error-controllers");

apiRouter.route("/").get(getApi);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.route("/*").all(trigger404);

module.exports = apiRouter;
