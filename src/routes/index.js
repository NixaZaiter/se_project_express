const express = require("express");

const router = express.Router();

const clothingItems = require("./clothingItems");
const users = require("./users");
const likes = require("./likes");
const auth = require("../middleware/auth");

const {
  validateCreateUser,
  validateLogin,
  validateItemId,
} = require("../middleware/validation");
const { NotFoundError } = require("../utils/errors/index");
const { loginUser, createUser } = require("../controllers/users");

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

router.post("/signin", validateLogin, loginUser);
router.post("/signup", validateCreateUser, createUser);
router.use("/items", clothingItems);

router.use(auth);
router.use("/users", users);
router.use("/items/:itemId/likes", validateItemId, likes);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
