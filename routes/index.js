const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const likes = require("./likes");
const auth = require("../middleware/auth");
const { ERROR_CODES } = require("../utils/errors");
const { loginUser, createUser } = require("../controllers/users");

router.post("/signin", loginUser);
router.post("/signup", createUser);
router.use("/items", clothingItems);

router.use(auth);
router.use("/users", users);
router.use("/items/:itemId/likes", likes);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND_ERROR_CODE).json({
    message: "Requested resource not found",
  });
});

module.exports = router;
