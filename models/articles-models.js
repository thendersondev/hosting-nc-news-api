const db = require("../db/connection");

exports.fetchAllArticles = async () => {
  return await db.query(`SELECT * FROM articles ORDER BY created_at desc;`);
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
  // if article exists return article
  if (rows.length === 1) {
    return rows[0];
  } else {
    // else throw 404
    return Promise.reject({ status: 404, msg: "Article not found" });
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
