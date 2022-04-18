const articlesRouter = require("express").Router();

const {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticle,
  removeArticleById,
  getRandomArticle,
} = require("../controllers/articles.controllers");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controllers");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter.get("/random", getRandomArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(removeArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
