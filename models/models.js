const db = require("../db/connection");

exports.fetchTopics = async () => {
  return await db.query(`SELECT * FROM topics;`);
};

exports.fetchArticle = async (id) => {
  return await db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]);
};
