const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/errors");

// Get list of items.
exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch(() => {
      res
        .status(ERROR_CODES.SERVER_ERROR_CODE)
        .send({ message: "Internal server error" });
    });
};

// Create a new clothing item.
exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        if (err.errors.name) {
          res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
            message: `${`Please provide a valid name between 2 and 30 characters`}`,
          });
          return;
        }
        if (err.errors.imageUrl) {
          res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
            message: `${`Please provide a valid image URL`}`,
          });
          return;
        }
        if (err.errors.weather) {
          res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
            message: `${`Please select a valid weather condition between "hot", "warm" or "cold"`}`,
          });
          return;
        }
        res.status(ERROR_CODES.VALIDATION_ERROR_CODE).send({
          message: "Validation error",
        });
        return;
      }
      res
        .status(ERROR_CODES.SERVER_ERROR_CODE)
        .send({ message: "Internal server error" });
    });
};

// Delete a clothing item.
exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        const error = new Error(
          "You do not have permission to delete this item"
        );
        error.code = ERROR_CODES.FORBIDDEN_ERROR_CODE;
        return Promise.reject(error);
      }
      return item;
    })
    .then((item) => ClothingItem.findByIdAndDelete(item._id))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.code === ERROR_CODES.FORBIDDEN_ERROR_CODE) {
        res
          .status(ERROR_CODES.FORBIDDEN_ERROR_CODE)
          .send({ message: "You do not have permission to delete this item" });
        return;
      }
      if (err.name === "CastError" || err.type === "ObjectId") {
        res
          .status(ERROR_CODES.VALIDATION_ERROR_CODE)
          .send({ message: "Invalid item ID" });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(ERROR_CODES.NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
        return;
      }
      res
        .status(ERROR_CODES.SERVER_ERROR_CODE)
        .send({ message: "Internal server error" });
    });
};
