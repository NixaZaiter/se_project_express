const route = require("express").Router();
const { addLike, removeLike } = require("../controllers/likes");

route.put("/items/:itemId/likes", addLike);
route.delete("/items/:itemId/likes", removeLike);

module.exports = route;
