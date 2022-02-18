const db = require("../db/connection");
const { checkIfExists } = require("./check-exists.model");

exports.fetchAllArticles = async (
  sort = "created_at",
  order = "desc",
  topic
) => {
  const articleCheck = await checkIfExists("articles", sort);
  switch (sort) {
    case "comment_count":
      break;
    default:
      if (!articleCheck) {
        return Promise.reject({
          status: 404,
          msg: "No articles found matching query criteria",
        });
      }
  }

  const topicCheck = await checkIfExists("topics", topic, "slug");
  switch (topic) {
    case undefined:
      break;
    default:
      if (!topicCheck) {
        return Promise.reject({
          status: 404,
          msg: "No articles found matching query criteria",
        });
      }
  }

  const validOrders = ["asc", "ASC", "desc", "DESC"];
  switch (validOrders.includes(order)) {
    case false:
      return Promise.reject({
        status: 400,
        msg: "Articles can only be ordered asc or desc",
      });
  }

  const topicQuery =
    topic === undefined ? "" : `WHERE articles.topic = '${topic}'`;

  const orderQuery =
    sort === "comment_count"
      ? `ORDER BY COUNT(comments.comment_id) ${order};`
      : `ORDER BY articles.${sort} ${order};`;

  return await db.query(
    `
    SELECT 
    articles.article_id, articles.title, articles.topic, 
    articles.author, articles.created_at, articles.votes, 
    CAST(COUNT(comments.comment_id) AS int) AS comment_count

    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    ${topicQuery}
    GROUP BY articles.article_id 
    ${orderQuery};`
  );
};

exports.fetchArticle = async (id) => {
  const articleCheck = await checkIfExists("articles", id, "article_id");
  switch (articleCheck) {
    case false:
      return Promise.reject({
        status: 404,
        msg: "Article not found",
      });
  }

  const { rows } = await db.query(
    `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
    [id]
  );

  return rows[0];
};

exports.updateArticleById = async (id, number) => {
  const articleCheck = await checkIfExists("articles", id, "article_id");
  switch (articleCheck) {
    case false:
      return Promise.reject({
        status: 404,
        msg: "Article not found",
      });
  }

  const { rows } = await db.query(
    `
      UPDATE articles 
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;`,
    [number, id]
  );
  return rows[0];
};
