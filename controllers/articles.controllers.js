const {
  selectArticleById,
  updateArticleById,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  const newVote = req.body.inc_votes;
  updateArticleById(article_id, newVote)
    .then((updated_article) => {
      res.status(200).send({ updated_article });
    })
    .catch(console.log);
};
