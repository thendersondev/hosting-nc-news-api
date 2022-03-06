const db = require("../db/connection");

exports.fetchTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics;`);
  return rows;
};

exports.createTopic = async ({ slug, description }) => {
  const { rows } = await db.query(
    `
    INSERT INTO topics
    (slug, description)
    VALUES
    ($1, $2)
    RETURNING *;`,
    [slug, description]
  );
  return rows[0];
};
