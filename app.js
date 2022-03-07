const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api-router");

const {
  handleInvalidEndpoint,
  handleCustomErrors,
  handlePsqlErrors,
  handle500Errors,
} = require("./controllers/errors.controllers");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handleInvalidEndpoint);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

module.exports = app;
