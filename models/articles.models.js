const db = require("../db/connection");

exports.selectArticleById = (articleId) => {
  return db
    .query(
      `
      SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
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

exports.selectArticles = (sortBy, order, topic) => {
  const validCols = [
    "author",
    "title",
    "article_id",
    "topic",
    "votes",
    "comment_count",
    "date",
  ];
  if (sortBy && !validCols.includes(sortBy))
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });

  if (!sortBy || sortBy === "date") sortBy = "created_at";

  if (order && !["asc", "desc"].includes(order))
    return Promise.reject({
      status: 400,
      msg: "Invalid order query - use 'asc' or 'desc'",
    });

  order = order === "asc" ? "ASC" : "DESC";

  let queryStr = `
    SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id `;

  prepValues = [];
  if (topic) {
    queryStr += `WHERE topic LIKE $1 `;
    prepValues.push(`${topic}`);
  }

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${order};`;

  return db.query(queryStr, prepValues).then(({ rows: articles }) => {
    if (!articles.length)
      return Promise.reject({
        status: 404,
        msg: "No articles found with that topic",
      });
    return articles;
  });
};
