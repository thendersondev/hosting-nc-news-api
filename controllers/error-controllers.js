exports.trigger404 = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.psqlErrors = (err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res.status(400).send({ msg: "Invalid input" });
    case "23502":
      res.status(400).send({ msg: "Invalid input" });
    default:
      next(err);
      break;
  }
};

exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err);
  } else {
    next(err);
  }
};

exports.trigger500 = (err, req, res) => {
  res.status(500).send(err);
};
