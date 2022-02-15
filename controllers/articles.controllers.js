const {
  selectArticleById,
  updateArticleById,
  selectArticles,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  const incVotes = req.body.inc_votes;
  updateArticleById(articleId, incVotes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (_, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
