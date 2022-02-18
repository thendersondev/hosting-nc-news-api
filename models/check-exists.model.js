const db = require("../db/connection");
const format = require("pg-format");

exports.checkIfExists = async (table, key, check) => {
  //checks if something exists in a specified table
  const formatted = format(
    "SELECT * FROM %I WHERE %I = %L;",
    table,
    key,
    check
  );
  const { rows } = await db.query(formatted);
  if (rows.length === 0) return false;
  else return true;
};
