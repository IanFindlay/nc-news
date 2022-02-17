const db = require("../db/connection");

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(
      `
  SELECT comment_id, votes, created_at, author, body
  FROM comments
  WHERE article_id = $1;
    `,
      [articleId]
    )
    .then(({ rows: comments }) => comments);
};

exports.insertCommentByArticleId = (articleId, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      `
    INSERT INTO comments
      (body, article_id, author)
    VALUES
      ($1, $2, $3)
    RETURNING *;`,
      [body, articleId, username]
    )
    .then(({ rows: [comment] }) => comment);
};

exports.deleteCommentById = (commentId) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1", [commentId]);
};
