const { selectUsers } = require("../models/users.models");

exports.getUsers = (_, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
