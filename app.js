const express = require("express");

const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById } = require("./controllers/articles.controllers");

const {
  handleInvalidEndpoint,
  handleCustomErrors,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("/*", handleInvalidEndpoint);

app.use(handleCustomErrors);

module.exports = app;
