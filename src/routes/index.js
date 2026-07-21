const router = require("express").Router();
const clothingItems = require("./clothingItems");
const users = require("./users");
const likes = require("./likes");
const auth = require("../middleware/auth");
const { NotFoundError } = require("../utils/errors/index");
const { loginUser, createUser } = require("../controllers/users");

router.post("/signin", loginUser);
router.post("/signup", createUser);
router.use("/items", clothingItems);

router.use(auth);
router.use("/users", users);
router.use("/items/:itemId/likes", likes);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
