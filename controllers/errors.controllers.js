exports.handleInvalidEndpoint = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (["22P02", "23503"].includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required field" });
  } else if (["2201W", "2201X"].includes(err.code)) {
    res
      .status(400)
      .send({ msg: "Limit and p queries must be positive integers" });
  } else if (err.code === "23505") {
    res.status(400).send({ msg: "Topic already exists" });
  } else next(err);
};

exports.handle500Errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Server error" });
};
