const route = require("express").Router();
const auth = require("../middleware/auth");
const {
  validateCreateClothingItem,
  validateItemId,
} = require("../middleware/validation");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

route.get("/", getClothingItems);

route.use(auth);
route.post("/", validateCreateClothingItem, createClothingItem);
route.delete("/:itemId", validateItemId, deleteClothingItem);

module.exports = route;
