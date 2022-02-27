const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentById,
  updateCommentById,
} = require("../models/comments.models");
const { checkExists } = require("../db/helpers/utils");

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const { limit, p: page } = req.query;
  const idExists = checkExists(
    "articles",
    "article_id",
    articleId,
    "No article matching requested id"
  );
  return Promise.all([articleId, idExists])
    .then(([articleId]) => {
      return selectCommentsByArticleId(articleId, limit, page);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const newComment = req.body;

  const idExists = checkExists(
    "articles",
    "article_id",
    articleId,
    "No article matching requested id"
  );
  return Promise.all([articleId, idExists])
    .then(([articleId]) => {
      return insertCommentByArticleId(articleId, newComment);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id: commentId } = req.params;
  return deleteCommentById(commentId)
    .then(() => {
      return res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id: commentId } = req.params;
  const { inc_votes: incVotes } = req.body;
  return updateCommentById(incVotes, commentId)
    .then((comment) => {
      return res.status(200).send({ comment });
    })
    .catch(next);
};
