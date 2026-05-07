const route = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

route.get("/items", getItems);
route.post("/items", createItem);
route.delete("/items/:itemId", deleteItem);

module.exports = route;
