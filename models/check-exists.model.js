const db = require("../db/connection");
const format = require("pg-format");

exports.checkIfExists = async (table, check, column) => {
  // checks if something exists in a specified table
  // takes optional third parameter to allow specified column to be checked
  const columnQuery = format("SELECT * FROM %I;", table);
  const { rows } = await db.query(columnQuery);

  if (column === undefined) {
    const keys = Object.keys(rows[0]);

    let coercedCheck = check;
    if (!isNaN(+check)) {
      coercedCheck = +check;
    }

    return keys.includes(coercedCheck)
      ? true
      : Promise.reject({
          status: 404,
          msg: `${table.slice(0, table.length - 1)}: ${check} not found`,
        });
  } else {
    if (column.endsWith("_id") && isNaN(check)) {
      return; // exit check early to allow PSQL error to trigger
    }

    const values = rows
      .map((entry) => {
        return entry[column];
      })
      .flat();

    let coercedCheck = check;
    if (!isNaN(+check)) {
      coercedCheck = +check;
    }

    return values.includes(coercedCheck)
      ? true
      : Promise.reject({
          status: 404,
          msg: `${table.slice(0, table.length - 1)}: ${check} not found`,
        });
  }
};
