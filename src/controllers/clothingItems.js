const ClothingItem = require("../models/clothingItem");
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../utils/errors/index");

// Get list of items.
exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      if (!items || items.length === 0) {
        throw new NotFoundError("No clothing items found");
      }
      res.send({ data: items });
    })
    .catch(next);
};

// Create a new clothing item.
exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Failed to add clothing item"));
      }
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        if (err.errors.name) {
          next(
            new BadRequestError(
              "Please provide a valid name between 2 and 30 characters"
            )
          );
          return;
        }
        if (err.errors.imageUrl) {
          next(new BadRequestError("Please provide a valid image URL"));
          return;
        }
        if (err.errors.weather) {
          next(
            new BadRequestError(
              `Please select a valid weather condition between "hot", "warm" or "cold"`
            )
          );
          return;
        }
        next(new BadRequestError("Validation error"));
        return;
      }
      next(err);
    });
};

// Delete a clothing item.
exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Clothing item not found");
      }
      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }
      return item;
    })
    .then((item) => ClothingItem.findByIdAndDelete(item._id))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError" || err.type === "ObjectId") {
        next(new BadRequestError("Invalid item ID"));
        return;
      }
      next(err);
    });
};
