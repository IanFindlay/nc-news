const db = require("../db/connection");
const { checkExists } = require("../db/helpers/utils");

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(
      `
  SELECT comment_id, votes, created_at, author, body
  FROM comments
  WHERE article_id = $1
    `,
      [articleId]
    )
    .then(({ rows: comments }) => comments);
};
