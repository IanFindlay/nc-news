const db = require("../db/connection");

exports.selectUsers = () => {
  return db
    .query("SELECT username FROM users;")
    .then(({ rows: users }) => users);
};

exports.selectUserByUsername = (username) => {
  return db
    .query(
      `
  SELECT username, avatar_url, name FROM users
  WHERE username = $1;`,
      [username]
    )
    .then(({ rows: [user] }) => {
      if (!user)
        return Promise.reject({
          status: 404,
          msg: "No user matching requested username",
        });
      return user;
    });
};
