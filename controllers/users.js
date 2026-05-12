const User = require("../models/user");
const { SOME_ERROR_CODE } = require("../utils/errors");

// Get list of users. [Tests Passed]
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(500).send({ message: "Internal server error" });
    });
};

// Get single user by ID. [Tests Passed]
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send({
          message: "Invalid user ID",
        });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(SOME_ERROR_CODE.NOT_FOUND_ERROR_CODE).send({
          message: "User not found",
        });
      } else {
        res
          .status(SOME_ERROR_CODE.SERVER_ERROR_CODE)
          .send({ message: "Internal server error" });
      }
    });
};

// Create a new user. [Tests Passed]
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        if (err.errors.name) {
          res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send({
            message: `${`Please provide a valid name between 2 and 30 characters`}`,
          });
        } else if (err.errors.avatar) {
          res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send({
            message: `${`Please provide a valid avatar URL`}`,
          });
        } else {
          res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send({
            message: "Validation error",
          });
        }
      } else {
        res.status(SOME_ERROR_CODE.SERVER_ERROR_CODE).send({
          message: "Internal server error",
        });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
