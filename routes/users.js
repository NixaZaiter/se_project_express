const route = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

route.get("/users", getUsers);
route.get("/users/:userId", getUser);
route.post("/users", createUser);

module.exports = route;
