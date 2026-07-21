const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors/index");

// Get currently signed-in user by ID.
exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
        return;
      }
      next(err);
    });
};

// Create a new user.
exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!password || typeof password !== "string") {
    next(new BadRequestError("Invalid password"));
    return;
  }

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
        next(new ConflictError("User with this email already exists"));
        return;
      }
      if (err.name === "ValidationError") {
        if (err.errors.name) {
          next(
            new BadRequestError(
              "Please provide a valid name between 2 and 30 characters"
            )
          );
          return;
        }

        if (err.errors.avatar) {
          next(new BadRequestError("Please provide a valid avatar URL"));
          return;
        }

        if (err.errors.email) {
          next(new BadRequestError("Please provide a valid email address"));
          return;
        }
        next(new BadRequestError("Validation error"));
        return;
      }
      next(err);
    });
};

// Login an existing user.
exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!password || !email) {
    next(new BadRequestError("Email and password are required"));
    return;
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.name === "AuthenticationError") {
        next(new UnauthorizedError("Invalid email or password"));
        return;
      }
      next(err);
    });
};

// Update an existing user. (Name and Avatar only)
exports.updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
        return;
      }
      if (err.name === "ValidationError") {
        if (err.errors.name) {
          next(
            new BadRequestError(
              "Please provide a valid name between 2 and 30 characters"
            )
          );
          return;
        }
        if (err.errors.avatar) {
          next(new BadRequestError("Please provide a valid avatar URL"));
          return;
        }
        next(new BadRequestError("Validation error"));
        return;
      }
      next(err);
    });
};
