const db = require("../db/connection");
const { checkIfExists } = require("./check-exists.model");

exports.fetchAllArticles = async (
  sort = "created_at",
  order = "desc",
  topic,
  limit = 10,
  page = 1
) => {
  switch (sort) {
    case "comment_count":
      // comment_count is an exception
      break;
    default:
      await checkIfExists("articles", sort);
  }

  switch (topic) {
    case undefined:
      // undefined is an exception
      break;
    default:
      await checkIfExists("topics", topic, "slug");
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
      ? `ORDER BY COUNT(comments.comment_id) ${order}`
      : `ORDER BY articles.${sort} ${order}`;

  let coercedPage = page;
  if (!isNaN(+page)) {
    coercedPage = +page;
  }

  const offset = limit * coercedPage - limit;

  return await db.query(
    `
    SELECT 
    articles.article_id, articles.title, articles.topic, 
    articles.author, articles.created_at, articles.votes, 
    CAST(COUNT(comments.comment_id) AS int) AS comment_count,
    CAST(COUNT(*) OVER() AS int) AS total_count

    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    ${topicQuery}
    GROUP BY articles.article_id 
    ${orderQuery}
    LIMIT $1 OFFSET $2;`,
    [limit, offset]
  );
};

exports.fetchArticle = async (id) => {
  await checkIfExists("articles", id, "article_id");

  const { rows } = await db.query(
    `
    SELECT 
    articles.*, 
    CAST(COUNT(comments.comment_id) AS int) AS comment_count

    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
    [id]
  );
  return rows[0];
};

exports.updateArticleById = async (id, number) => {
  await checkIfExists("articles", id, "article_id");

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

exports.createArticle = async ({ author, title, body, topic }) => {
  await checkIfExists("users", author, "username");
  await checkIfExists("topics", topic, "slug");

  const { rows } = await db.query(
    `
    INSERT INTO articles
    (author, title, body, topic)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *;`,
    [author, title, body, topic]
  );
  return rows[0];
};
