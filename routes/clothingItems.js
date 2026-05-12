const route = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

route.get("/items", getClothingItems);
route.post("/items", createClothingItem);
route.delete("/items/:itemId", deleteClothingItem);

module.exports = route;
