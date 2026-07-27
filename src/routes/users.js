const route = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

route.get("/me", getCurrentUser);
route.patch("/me", updateUser);

module.exports = route;
