const db = require("../db/connection");

exports.fetchUsers = async () => {
  return await db.query(`SELECT * FROM users;`);
};

exports.fetchUser = async (username) => {
  const { rows } = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  if (rows.length === 0) {
    return Promise.reject({ status: 400, msg: "Username not found" });
  } else {
    return rows[0];
  }
};
