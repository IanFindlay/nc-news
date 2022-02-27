const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => topics);
};

exports.insertTopic = (slug, description) => {
  return db
    .query(
      `
    INSERT INTO topics
      (slug, description)
    VALUES
      ($1, $2)
    RETURNING *;
  `,
      [slug, description]
    )
    .then(({ rows: [topic] }) => topic);
};
