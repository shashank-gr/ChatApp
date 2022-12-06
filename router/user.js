const { Router } = require("express");
const userController = require("../controllers/user");
const router = Router();

router.post("/register", userController.postRegister);
router.post("/login", userController.postLogin);

module.exports = router;
