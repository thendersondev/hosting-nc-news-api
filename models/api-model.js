const fs = require("fs.promises");

exports.fetchApi = async () => {
  const api = await fs.readFile(`${__dirname}/../endpoints.json`);
  return JSON.parse(api);
};
