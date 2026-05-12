const ClothingItem = require("../models/clothingItem");
const { SOME_ERROR_CODE } = require("../utils/errors");

// Get list of items. [Tests Passed]
module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch(() => {
      res.status(500).send({ message: "Internal server error" });
    });
};

// Create a new clothing item. [Tests Passed]
module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        if (err.errors.name) {
          return res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send({
            message: `${`Please provide a valid name between 2 and 30 characters`}`,
          });
        }
        if (err.errors.imageUrl) {
          return res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send({
            message: `${`Please provide a valid image URL`}`,
          });
        }
        if (err.errors.weather) {
          return res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send({
            message: `${`Please select a valid weather condition between "hot", "warm" or "cold"`}`,
          });
        }
        return res.status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE).send();
      }
      return res.status(500).send({ message: "Internal server error" });
    });
};

// Delete a clothing item. [Tests Passed]
module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError" || err.type === "ObjectId") {
        return res
          .status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE)
          .send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(SOME_ERROR_CODE.NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }
      return res
        .status(SOME_ERROR_CODE.SERVER_ERROR_CODE)
        .send({ message: "Internal server error" });
    });
};
