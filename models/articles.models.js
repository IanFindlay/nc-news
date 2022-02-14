const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows: [article] }) => {
      if (!article)
        return Promise.reject({
          status: 404,
          msg: "No article matching requested id",
        });
      return article;
    });
};

exports.updateArticleById = (article_id, incVotes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [incVotes, article_id]
    )
    .then(({ rows: [article] }) => {
      return article;
    });
};
