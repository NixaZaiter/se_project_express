const User = require("../models/user");
const { SOME_ERROR_CODE } = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.log(err.name);
      res.status(500).send({ message: "Internal server error" });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        return res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send({
          message: "Invalid user ID",
        });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(SOME_ERROR_CODE.NOT_FOUND_ERROR_CODE).send({
          message: "User not found",
        });
      }
      return res
        .status(SOME_ERROR_CODE.SERVER_ERROR_CODE)
        .send({ message: "Internal server error" });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      console.log(err);

      if (err.name === "ValidationError") {
        if (err.errors.name) {
          return res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send({
            message: `${`Please provide a valid name between 2 and 30 characters`}`,
          });
        }
        if (err.errors.avatar) {
          return res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send({
            message: `${`Please provide a valid avatar URL`}`,
          });
        }
        return res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send();
      }
      return res.status(500).send({ message: "Internal server error" });
    });
};
