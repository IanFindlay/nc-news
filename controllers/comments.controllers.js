const { selectCommentsByArticleId } = require("../models/comments.models");
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
