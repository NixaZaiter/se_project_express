const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const likes = require("./likes");
const SOME_ERROR_CODE = require("../utils/errors");

router.use("/", clothingItems);
router.use("/", users);
router.use("/", likes);

router.use((req, res) => {
  res.status(SOME_ERROR_CODE.NOT_FOUND_ERROR_CODE).json({
    message: "Requested resource not found",
  });
});

module.exports = router;
