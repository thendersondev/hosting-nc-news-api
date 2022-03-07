const express = require("express");
const cors = require("cors");
const app = express();

// controller requiring
const {
  psqlErrors,
  customErrors,
  trigger500,
} = require("./controllers/error-controllers");
const apiRouter = require("./routes/api-router");
// controller requiring

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

// errors
app.use(psqlErrors);
app.use(customErrors);
app.use(trigger500);

// const { PORT = 9090 } = process.env;

// app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

module.exports = app;
