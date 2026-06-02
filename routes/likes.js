const route = require("express").Router({ mergeParams: true });
const { addLike, removeLike } = require("../controllers/likes");

route.put("/", addLike);
route.delete("/", removeLike);

module.exports = route;
