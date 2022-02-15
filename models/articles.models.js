const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  return db
    .query(
      `
      SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
      `,
      [articleId]
    )
    .then(({ rows: [article] }) => {
      if (!article)
        return Promise.reject({
          status: 404,
          msg: "No article matching requested id",
        });
      return article;
    });
};

exports.updateArticleById = (articleId, incVotes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [incVotes, articleId]
    )
    .then(({ rows: [article] }) => {
      if (!article)
        return Promise.reject({
          status: 404,
          msg: "No article matching requested id",
        });
      return article;
    });
};
