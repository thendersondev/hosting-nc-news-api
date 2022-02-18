const db = require("../db/connection");
const { checkIfExists } = require("./check-exists.model");

exports.fetchCommentsByArticleId = async (id) => {
  await checkIfExists("articles", id, "article_id");

  const { rows } = await db.query(
    `SELECT * FROM comments WHERE article_id = $1`,
    [id]
  );
  return rows;
};

exports.makeComment = async (id, username, body) => {
  await checkIfExists("articles", id, "article_id");
  await checkIfExists("users", username, "username");

  const { rows } = await db.query(
    `
    INSERT INTO comments 
    (body, votes, author, article_id)
    VALUES 
    ($1, 0, $2, $3)
    RETURNING *;`,
    [body, username, id]
  );
  return rows;
};
