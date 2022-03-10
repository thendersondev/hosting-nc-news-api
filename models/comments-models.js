const db = require("../db/connection");
const { checkIfExists } = require("./check-exists.model");

exports.fetchCommentsByArticleId = async (
  id,
  limit = 10,
  p = 1,
  sort = "created_at",
  order = "desc"
) => {
  await checkIfExists("articles", id, "article_id");
  await checkIfExists("comments", sort);

  const validOrders = ["asc", "ASC", "desc", "DESC"];
  switch (validOrders.includes(order)) {
    case false:
      return Promise.reject({
        status: 400,
        msg: "Comments can only be ordered asc or desc",
      });
  }

  const offset = limit * p - limit;

  const { rows } = await db.query(
    `
    SELECT * FROM comments 
    WHERE article_id = $1
    ORDER BY ${sort} ${order}
    LIMIT $2 OFFSET $3`,
    [id, limit, offset]
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

exports.cancelComment = async (id) => {
  await checkIfExists("comments", id, "comment_id");

  const { rows } = await db.query(
    `
    DELETE FROM comments 
    WHERE comment_id = $1 
    RETURNING *;`,
    [id]
  );
  return rows[0];
};

exports.updateComment = async (id, inc) => {
  await checkIfExists("comments", id, "comment_id");

  const { rows } = await db.query(
    `
    UPDATE comments 
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`,
    [inc, id]
  );
  return rows[0];
};
