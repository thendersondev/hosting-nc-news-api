const db = require("../db/connection");
const format = require("pg-format");

exports.checkIfExists = async (table, check) => {
  //checks if something exists in a specified table
  const keysQuery = format("SELECT * FROM %I;", table);
  const { rows } = await db.query(keysQuery);

  const values = rows
    .map((entry) => {
      return Object.values(entry);
    })
    .flat();

  return values.includes(check);
};
