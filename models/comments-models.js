const db = require("../db/connection");

exports.fetchCommentsByArticleId = async (id) => {
  return await db.query(`SELECT * FROM comments WHERE article_id = $1`, [id]);
};
