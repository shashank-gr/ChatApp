const { Router } = require("express");
const router = Router();
const autenticate = require("../middleware/autenticate");
const chatController = require("../controllers/chat");

router.post(
  "/chatMessage",
  autenticate.authenticateToken,
  chatController.postChatMessage
);
router.get(
  "/allchats/:withUserId",
  autenticate.authenticateToken,
  chatController.getAllChats
);
router.get(
  "/allusers",
  autenticate.authenticateToken,
  chatController.getAllUser
);

module.exports = router;
