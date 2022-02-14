const express = require("express");

const { getTopics } = require("./controllers/topics.controllers");

const { handleInvalidEndpoint } = require("./controllers/errors.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/*", handleInvalidEndpoint);

module.exports = app;
