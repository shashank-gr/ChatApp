const { Op } = require("sequelize");
const Group = require("../model/group");
const User = require("../model/user");
const Groupmessage = require("../model/groupmessage");
const Usergroup = require("../model/usergroup");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { id: { [Op.ne]: +req.user.id } },
      attributes: ["id", "email"],
    });
    res.status(200).send({ users, msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const groups = await req.user.getGroups({
      attributes: ["id", "groupName"],
      through: { admin: true },
    });
    // console.log(groups);
    res.status(200).send({ groups, msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
exports.getAllUserGroups = async (req, res) => {
  try {
    const userGroups = await req.user.getGroups({
      attributes: ["id", "groupName"],
    });
    // console.log(userGroups);
    res.status(200).send({ userGroups, msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
exports.getAllGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    // console.log(groupId);
    const groupMessages = await Groupmessage.findAll({
      limit: 15,
      order: [["updatedAt", "DESC"]],
      where: { groupId },
      attributes: ["userName", "message"],
    });
    // console.log(groupMessages);
    res
      .status(200)
      .send({ groupMessages: groupMessages.reverse(), msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
exports.postSendGroupMessage = async (req, res) => {
  try {
    const { groupMessage, groupId } = req.body;
    const userName = req.user.name;
    // console.log(userName, groupMessage, groupId);
    const response = await Groupmessage.create({
      message: groupMessage,
      groupId: +groupId,
      userName,
    });
    console.log(response);
    res.status(201).send({ msg: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
exports.postCreateGroup = async (req, res) => {
  try {
    const user = req.user;
    const { groupName } = req.body;
    await user.createGroup({ groupName }, { through: { admin: true } });
    res.status(200).send("success");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
exports.postAddUser = async (req, res) => {
  try {
    const { groupName, email, admin } = req.body;
    const user = await User.findOne({ where: { email } });
    const group = await Group.findOne({ where: { groupName } });
    if (!user) {
      return res
        .status(400)
        .send({ msg: "bad parameter, user or group not found" });
    }
    const userInUserGroup = await Usergroup.findOne({
      where: { userId: +user.id, groupId: +group.id },
    });
    if (!userInUserGroup) {
      await Usergroup.create({ admin, userId: +user.id, groupId: +group.id });
      return res.status(201).send({ msg: "Added to group" });
    }
    await Usergroup.update(
      { admin },
      { where: { userId: +user.id, groupId: +group.id } }
    );
    return res.status(201).send({ msg: "Added to group" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

exports.postDeleteUser = async (req, res) => {
  try {
    const { groupName, email } = req.body;
    const { id: groupId } = await Group.findOne({ where: { groupName } });
    const userHasPermission = await Usergroup.findOne({
      where: { admin: true, groupId, userId: +req.user.id },
    });
    if (userHasPermission) {
      // console.log(userHasPermission);
      const userToBeRemoved = await User.findOne({ where: { email } });
      const removeUser = await Usergroup.destroy({
        where: { userId: userToBeRemoved.id, groupId },
      });
      if (removeUser) {
        return res.status(200).send({ msg: "success" });
      }
      return res.status(400).send({ msg: "user is not present in group" });
    }
    return res
      .status(404)
      .send({ msg: "You dont have admin privileges for this group" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};
