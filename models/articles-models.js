const db = require("../db/connection");

exports.fetchAllArticles = async (sort = "created_at", order = "desc") => {
  const validOrders = ["asc", "ASC", "desc", "DESC"];

  if (sort === "comment_count" && validOrders.includes(order)) {
    return await db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, 
    articles.votes, CAST(COUNT(comments.comment_id) AS int) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY COUNT(comments.comment_id) ${order};`);
  }

  const validArticleSorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
  ];

  if (validArticleSorts.includes(sort) && validOrders.includes(order)) {
    return await db.query(`
    SELECT 
    articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, 
    articles.votes, CAST(COUNT(comments.comment_id) AS int) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.${sort} ${order};`);
  }
};

exports.fetchArticle = async (id) => {
  const { rows } = await db.query(
    `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
    [id]
  );
  // if article doesn't exist throw 404
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  } else {
    // else return article
    return rows[0];
  }
};

exports.updateArticleById = async (id, number) => {
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
