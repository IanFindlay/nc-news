const commentsRouter = require("express").Router();

const {
  removeCommentById,
  patchCommentById,
} = require("../controllers/comments.controllers");

commentsRouter
  .route("/:comment_id")
  .delete(removeCommentById)
  .patch(patchCommentById);

module.exports = commentsRouter;
