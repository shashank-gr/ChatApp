const { Router } = require("express");
const router = Router();
const autenticate = require("../middleware/autenticate");
const groupController = require("../controllers/group");

router.post(
  "/createGroup",
  autenticate.authenticateToken,
  groupController.postCreateGroup
);
router.get(
  "/allusers",
  autenticate.authenticateToken,
  groupController.getAllUsers
);
router.get(
  "/allgroups",
  autenticate.authenticateToken,
  groupController.getAllGroups
);
router.post(
  "/adduser",
  autenticate.authenticateToken,
  groupController.postAddUser
);
router.post(
  "/deleteuser",
  autenticate.authenticateToken,
  groupController.postDeleteUser
);
router.get(
  "/allusergroups",
  autenticate.authenticateToken,
  groupController.getAllUserGroups
);
router.get(
  "/allgroupmessages/:groupId",
  autenticate.authenticateToken,
  groupController.getAllGroupMessages
);
router.post(
  "/sendgroupmessage",
  autenticate.authenticateToken,
  groupController.postSendGroupMessage
);
module.exports = router;
