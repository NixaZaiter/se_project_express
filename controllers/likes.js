const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/errors");

const handleError = (err, res) => {
  if (err.name === "CastError") {
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
};

// Logic for adding a like
exports.addLike = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => res.send({ data: updatedItem }))
    .catch((err) => handleError(err, res));

// Logic for removing a like
exports.removeLike = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => res.send({ data: updatedItem }))
    .catch((err) => handleError(err, res));
