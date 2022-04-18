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

exports.selectArticles = (sortBy, order, topic, limit = 10, page = 1) => {
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

  const offset = (page - 1) * limit;

  let queryStr = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id `;

  let prepValues = [];
  if (topic) {
    queryStr += `WHERE topic LIKE $1 `;
    prepValues.push(`${topic}`);
  }

  let noLimitQuery = queryStr;
  let noLimitPrep = [...prepValues];

  noLimitQuery += `
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${order};`;

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sortBy} ${order}
    `;

  if (limit === "0") queryStr += "LIMIT ALL OFFSET 0;";
  else {
    queryStr += `LIMIT $${prepValues.length + 1} OFFSET $${
      prepValues.length + 2
    };`;
    prepValues.push(limit, offset);
  }

  const noLimit = db.query(noLimitQuery, noLimitPrep);
  const limited = db.query(queryStr, prepValues);
  return Promise.all([noLimit, limited]).then(
    ([{ rows: noLimitArticles }, { rows: articles }]) => {
      if (!noLimitArticles.length)
        return Promise.reject({
          status: 404,
          msg: "No articles found with that topic",
        });
      if (!articles.length) {
        return Promise.reject({
          status: 404,
          msg: "End of articles reached - lower your limit or p query",
        });
      }
      return [articles, noLimitArticles.length];
    }
  );
};

exports.insertArticle = (newArticle) => {
  const { title, topic, author, body } = newArticle;
  return db
    .query(
      `
    INSERT INTO articles
      (title, topic, author, body)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *;
    `,
      [title, topic, author, body]
    )
    .then(({ rows: [article] }) => {
      article.comment_count = 0;
      return article;
    });
};

exports.deleteArticleById = (articleId) => {
  return db
    .query("DELETE FROM articles WHERE article_id = $1 RETURNING *;", [
      articleId,
    ])
    .then(({ rows: [article] }) => {
      if (!article)
        return Promise.reject({
          status: 404,
          msg: "No article matching requested id",
        });
      return article;
    });
};

exports.selectArticleIds = () => {
  return db
    .query("SELECT article_id FROM articles;")
    .then(({ rows: articleIds }) => articleIds);
};
