const ClothingItem = require("../models/clothingItem");
const { BadRequestError, NotFoundError } = require("../utils/errors/index");

const handleError = (err, res, next) => {
  if (err.name === "CastError") {
    next(new BadRequestError("Invalid item ID"));
    return;
  }
  if (err.name === "DocumentNotFoundError") {
    next(new NotFoundError("Item not found"));
    return;
  }
  next(err);
};

// Logic for adding a like
exports.addLike = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => res.send({ data: updatedItem }))
    .catch((err) => handleError(err, res, next));

// Logic for removing a like
exports.removeLike = (req, res, next) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => res.send({ data: updatedItem }))
    .catch((err) => handleError(err, res, next));
