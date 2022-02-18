const db = require("../db/connection");
const { checkIfExists } = require("./check-exists.model");

exports.fetchUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users;`);
  return rows;
};

exports.fetchUserById = async (username) => {
  await checkIfExists("users", username, "username");

  const { rows } = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  return rows[0];
};
