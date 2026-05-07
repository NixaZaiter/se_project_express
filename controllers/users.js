const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send(err));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      }
      res.send(user);
    })
    .catch((err) => res.status(500).send(err));
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(500).send(err));
};
