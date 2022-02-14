const db = require("../db/connection");

exports.fetchTopics = async () => {
  return await db.query(`SELECT * FROM topics;`);
};

exports.fetchArticle = async (id) => {
  return await db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]);
};

exports.updateArticleById = async (id, number) => {
  return await db.query(
    `
  UPDATE articles 
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
    [number, id]
  );
};
