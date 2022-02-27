const db = require("../db/connection");

exports.selectCommentsByArticleId = (articleId, limit = 10, page = 1) => {
  const offset = (page - 1) * limit;
  const query = db.query(
    `
  SELECT comment_id, votes, created_at, author, body
  FROM comments
  WHERE article_id = $1
  LIMIT ${limit} OFFSET ${offset};
    `,
    [articleId]
  );
  return Promise.all([offset, query]).then(([offset, { rows: comments }]) => {
    if (!comments.length && offset)
      return Promise.reject({
        status: 404,
        msg: "End of comments reached - lower your limit or p query",
      });
    return comments;
  });
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
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      commentId,
    ])
    .then(({ rows: [comment] }) => {
      if (!comment)
        return Promise.reject({
          status: 404,
          msg: "No comment matching requested id",
        });
      return comment;
    });
};

exports.updateCommentById = (incVotes, commentId) => {
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
      [incVotes, commentId]
    )
    .then(({ rows: [comment] }) => {
      if (!comment)
        return Promise.reject({
          status: 404,
          msg: "No comment matching requested id",
        });
      return comment;
    });
};
