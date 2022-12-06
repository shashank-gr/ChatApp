const { Router } = require("express");
const router = Router();
const autenticate = require("../middleware/autenticate");
const userController = require("../controllers/chat");

router.post(
  "/chatMessage",
  autenticate.authenticateToken,
  userController.postChatMessage
);

module.exports = router;
