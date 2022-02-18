const db = require("../db/connection");
const { fetchTopics } = require("./topics-models");

exports.fetchAllArticles = async (
  sort = "created_at",
  order = "desc",
  topic
) => {
  // pulling valid topics from topics table
  const { rows: topics } = await fetchTopics();
  const validTopics = topics.map(({ slug }) => {
    return slug;
  });

  let topicQuery = "";
  if (validTopics.includes(topic)) {
    topicQuery = `WHERE articles.topic = '${topic}'`;
  }

  const validOrders = ["asc", "ASC", "desc", "DESC"];
  const validSorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (
    !validSorts.includes(sort) ||
    (!validTopics.includes(topic) && topic !== undefined)
  ) {
    return Promise.reject({
      status: 404,
      msg: "No articles found matching query criteria",
    });
  } else if (!validOrders.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Articles can only be ordered asc or desc",
    });
  }

  if (validSorts.includes(sort) && validOrders.includes(order)) {
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
