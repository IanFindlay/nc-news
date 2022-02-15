const { selectTopics } = require("../models/topics.models");

exports.getTopics = (_, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
