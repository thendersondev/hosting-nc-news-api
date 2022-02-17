const db = require("../db/connection");

exports.fetchCommentsByArticleId = async (id) => {
  return await db.query(`SELECT * FROM comments WHERE article_id = $1`, [id]);
};

exports.makeComment = async (id, username, body) => {
  return await db.query(
    `
    INSERT INTO comments 
    (body, votes, author, article_id)
    VALUES 
    ($1, 0, $2, $3)
    RETURNING *;`,
    [body, username, id]
  );
};
