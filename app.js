const express = require("express");

const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("./controllers/articles.controllers");

const {
  handleInvalidEndpoint,
  handleCustomErrors,
  handlePsqlErrors,
  handle500Errors,
} = require("./controllers/errors.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/articles", getArticles);

app.all("/*", handleInvalidEndpoint);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

module.exports = app;
