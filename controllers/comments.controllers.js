const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentById,
} = require("../models/comments.models");
const { checkExists } = require("../db/helpers/utils");

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const idExists = checkExists(
    "articles",
    "article_id",
    articleId,
    "No article matching requested id"
  );
  return Promise.all([articleId, idExists])
    .then(([articleId]) => {
      return selectCommentsByArticleId(articleId);
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

  const idExists = checkExists(
    "comments",
    "comment_id",
    commentId,
    "No comment matching requested id"
  );
  return Promise.all([commentId, idExists])
    .then(([commentId]) => {
      return deleteCommentById(commentId);
    })
    .then(() => res.status(204).send())
    .catch(next);
};
