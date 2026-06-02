const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ERROR_CODES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// Get currently signed-in user by ID.
exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
          message: "Invalid user ID",
        });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(ERROR_CODES.NOT_FOUND_ERROR_CODE).send({
          message: "User not found",
        });
        return;
      }
      res
        .status(ERROR_CODES.SERVER_ERROR_CODE)
        .send({ message: "Internal server error" });
    });
};

// Create a new user.
exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const duplicateEmail = new Error("User with this email already exists");
        duplicateEmail.code = 11000;
        return Promise.reject(duplicateEmail);
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(201).send({ data: userObject });
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(ERROR_CODES.DUPLICATE_ERROR_CODE).send({
          message: "User with this email already exists",
        });
        return;
      }
      if (err.name === "ValidationError") {
        if (err.errors.name) {
          res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
            message: `Please provide a valid name between 2 and 30 characters`,
          });
          return;
        }
        if (err.errors.avatar) {
          res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
            message: `Please provide a valid avatar URL`,
          });
          return;
        }
        if (err.errors.email) {
          res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
            message: `Please provide a valid email address`,
          });
          return;
        }
        res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
          message: "Validation error",
        });
        return;
      }
      res.status(ERROR_CODES.SERVER_ERROR_CODE).send({
        message: "Internal server error",
      });
    });
};

// Login an existing user.
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch(() => {
      res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
        message: "Invalid email or password",
      });
    });
};

// Update an existing user. (Name and Avatar only)
exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODES.NOT_FOUND_ERROR_CODE).send({
          message: "User not found",
        });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        if (err.errors.name) {
          res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
            message: `Please provide a valid name between 2 and 30 characters`,
          });
          return;
        }
        if (err.errors.avatar) {
          res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
            message: `Please provide a valid avatar URL`,
          });
          return;
        }
        res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
          message: "Validation error",
        });
        return;
      }
      res.status(ERROR_CODES.SERVER_ERROR_CODE).send({
        message: "Internal server error",
      });
    });
};
