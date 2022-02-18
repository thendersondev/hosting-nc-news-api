const db = require("../db/connection");
const format = require("pg-format");

exports.checkIfExists = async (table, check, column) => {
  //checks if something exists in a specified table
  const columnQuery = format("SELECT * FROM %I;", table);
  const { rows } = await db.query(columnQuery);

  if (column === undefined) {
    const keys = Object.keys(rows[0]);

    return keys.includes(check);
  } else {
    const values = rows
      .map((entry) => {
        return entry[column];
      })
      .flat();

    return values.includes(check);
  }
};
