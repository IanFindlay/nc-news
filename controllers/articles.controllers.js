const {
  selectArticleById,
  updateArticleById,
  selectArticles,
  insertArticle,
  deleteArticleById,
  selectArticleIds,
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

exports.getArticles = (req, res, next) => {
  const { sort_by: sortBy, order, topic, limit, p: page } = req.query;
  selectArticles(sortBy, order, topic, limit, page)
    .then(([articles, total_count]) => {
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  insertArticle(newArticle)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.removeArticleById = (req, res, next) => {
  const { article_id: articleId } = req.params;
  return deleteArticleById(articleId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getRandomArticle = (_, res, next) => {
  selectArticleIds()
    .then((articleIds) => {
      chosenId =
        articleIds[Math.floor(Math.random() * articleIds.length)].article_id;
      return selectArticleById(chosenId);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
