const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const likes = require("./likes");

router.use("/", clothingItems);
router.use("/", users);
router.use("/", likes);

router.use((req, res) => {
  res.status(404).json({
    message: "Requested resource not found",
  });
});

module.exports = router;
