const ClothingItem = require("../models/clothingItem");
const { SOME_ERROR_CODE } = require("../utils/errors");

const handleError = (err, res) => {
  if (err.name === "CastError") {
    res
      .status(SOME_ERROR_CODE.VALIDATION_ERROR_CODE)
      .send({ message: "Invalid item ID" });
  } else if (err.name === "DocumentNotFoundError") {
    res
      .status(SOME_ERROR_CODE.NOT_FOUND_ERROR_CODE)
      .send({ message: "Item not found" });
  } else {
    res
      .status(SOME_ERROR_CODE.SERVER_ERROR_CODE)
      .send({ message: "Internal server error" });
  }
};

// Logic for adding a like [Tests Passed]
const addLike = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => res.send({ data: updatedItem }))
    .catch((err) => handleError(err, res));

// Logic for removing a like [Tests Passed]
const removeLike = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => res.send({ data: updatedItem }))
    .catch((err) => handleError(err, res));

module.exports = {
  addLike,
  removeLike,
};
