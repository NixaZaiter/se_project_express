const route = require("express").Router();
const auth = require("../middleware/auth");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

route.get("/", getClothingItems);

route.use(auth);
route.post("/", createClothingItem);
route.delete("/:itemId", deleteClothingItem);

module.exports = route;
