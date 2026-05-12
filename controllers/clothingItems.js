const ClothingItem = require("../models/clothingItem");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    });
};
